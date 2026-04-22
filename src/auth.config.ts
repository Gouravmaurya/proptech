import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/auth/login',
    },
    session: { strategy: "jwt" },
    providers: [], // Providers are added in auth.ts
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const path = nextUrl.pathname;
            
            console.log(`[Auth Debug] Path: ${path}, LoggedIn: ${isLoggedIn}`);

            // Avoid redirecting API routes (like /api/auth/session) to HTML pages to prevent JSON parse errors
            if (path.startsWith("/api")) {
                return true;
            }

            const isOnOnboarding = path === '/onboarding';
            const isAuthPage = path === '/auth/login' || path === '/auth/register';

            // Routes that require authentication (dashboard sub-pages that are personal/AI features)
            const isProtectedDashboard =
                path.startsWith('/dashboard/saved') ||
                path.startsWith('/dashboard/settings') ||
                path.startsWith('/dashboard/scout');

            if (isLoggedIn) {
                const completed = (auth.user as any).onboardingCompleted === true;
                const needsOnboarding = !completed;

                if (needsOnboarding && !isOnOnboarding) {
                    return Response.redirect(new URL('/onboarding', nextUrl));
                }
                if (!needsOnboarding && isOnOnboarding) {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
                if (isAuthPage) {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
            } else {
                // Block unauthenticated users from personal/AI dashboard sub-routes and onboarding
                if (isProtectedDashboard || isOnOnboarding) {
                    const loginUrl = new URL('/auth/login', nextUrl);
                    loginUrl.searchParams.set('callbackUrl', nextUrl.href);
                    return Response.redirect(loginUrl);
                }
                // /dashboard (main), /properties/[id], and all public pages are freely accessible
            }

            return true;
        },
        async session({ session, token }: any) {
            if (session?.user && token?.sub) {
                session.user.id = token.sub;
                session.user.onboardingCompleted = token.onboardingCompleted;
            }
            return session;
        },
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.sub = user.id;
                token.onboardingCompleted = user.onboardingCompleted;
            }
            if (trigger === "update" && session?.onboardingCompleted !== undefined) {
                token.onboardingCompleted = session.onboardingCompleted;
            }
            return token;
        }
    }
} satisfies NextAuthConfig;
