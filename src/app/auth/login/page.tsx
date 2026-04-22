"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                window.location.href = callbackUrl;
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const onGoogle = async () => {
        setLoading(true);
        await signIn("google", { callbackUrl });
    };

    return (
        <div className="min-h-screen bg-white flex text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">

            {/* LEFT SIDE: Visual Content */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-950 p-12 lg:p-16 relative overflow-hidden text-white">
                <Image
                    src="/login_cover_house.png"
                    alt="Luxury Villa"
                    fill
                    className="object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-1000"
                    priority
                />
                
                {/* Dark Gradient Overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-900/20 z-1" />

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors font-medium mb-8 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-md">
                        Unlock Market <br /> Intelligence.
                    </h1>
                    <p className="text-lg text-slate-200 max-w-md leading-relaxed drop-shadow-sm font-medium">
                        Join thousands of investors using AI to find, underwrite, and close deals faster than ever before.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-200 bg-black/30 backdrop-blur-md p-4 rounded-3xl border border-white/5 inline-flex">
                        <span>Trusted by top investors</span>
                        <div className="flex -space-x-3 ml-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center shadow-md overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Application Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-sm space-y-8">

                    <div className="text-center lg:text-left">
                        {/* Mobile Home Link */}
                        <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors text-sm">
                            <ArrowLeft className="w-4 h-4" /> Home
                        </Link>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Sign in to Haven</h2>
                        <p className="text-sm text-slate-500 mt-2">Welcome back. Please enter your details.</p>
                    </div>

                    <div className="grid gap-4">
                        <button
                            onClick={onGoogle}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 w-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium h-11 rounded-lg transition-all focus:ring-2 focus:ring-slate-200 outline-none disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                <>
                                    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                                    <span>Sign in with Google</span>
                                </>
                            )}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">Or with email</span>
                            </div>
                        </div>

                        <form onSubmit={onLogin} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50 text-slate-900"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-700">Password</label>
                                    <a href="#" className="text-sm text-emerald-600 hover:text-emerald-500 font-medium">Forgot?</a>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50 text-slate-900"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-11 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                            >
                                {loading ? "Logging in..." : "Sign in"}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                            Sign up
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}

