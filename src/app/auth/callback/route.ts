import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Database Sync Logic (Placeholder)
            // This is where we would check if it's the first login and sync metadata
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // console.log("User logged in:", user.id, user.user_metadata)
                // Insert into 'loans' or 'users' table logic here:
                /*
                const { error: dbError } = await supabase
                  .from('users')
                  .upsert({ 
                      id: user.id, 
                      email: user.email, 
                      phone: user.phone,
                      last_login: new Date().toISOString()
                  })
                */
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/?error=auth_code_error`)
}
