"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);

    const loadingMessages = [
        "Creating your account...",
        "Securing your personal haven...",
        "Curating your dashboard...",
        "Finalizing setup..."
    ];

    // Cycle through loading messages
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            interval = setInterval(() => {
                setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const onRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name })
            });

            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || "Registration failed");
            }

            await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            window.location.href = "/onboarding";
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const onGoogle = async () => {
        setLoading(true);
        await signIn("google", { callbackUrl: "/onboarding" });
    };

    return (
        <div className="min-h-screen bg-white flex text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">

            {/* LEFT SIDE: Feature List */}
            <div className="hidden lg:flex flex-col justify-center w-1/2 bg-slate-950 p-12 lg:p-16 relative overflow-hidden text-white">
                <Image
                    src="/register_cover_house.png"
                    alt="Scandinavian Villa"
                    fill
                    className="object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-1000"
                    priority
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/30 z-1" />

                <div className="relative z-10 max-w-lg">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors font-medium mb-12 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    <h2 className="text-3xl md:text-4xl font-black text-white mb-8 drop-shadow-md">
                        Why Top Investors <br /> Choose Haven?
                    </h2>

                    <div className="space-y-6">
                        {[
                            { title: "AI-Powered Underwriting", desc: "Analyze 50+ financial metrics in seconds." },
                            { title: "Off-Market Discovery", desc: "Find deals before they hit Zillow or LoopNet." },
                            { title: "10-Year Projections", desc: "Visualize cash flow and appreciation scenarios." }
                        ].map((feature, idx) => (
                            <div key={idx} className="flex gap-4 items-start bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
                                <div className="mt-1 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{feature.title}</h3>
                                    <p className="text-slate-300 text-sm mt-1">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors text-sm">
                            <ArrowLeft className="w-4 h-4" /> Home
                        </Link>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h2>
                        <p className="text-sm text-slate-500 mt-2">Start your free 14-day trial. No credit card required.</p>
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
                                    <span>Sign up with Google</span>
                                </>
                            )}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">Or register with email</span>
                            </div>
                        </div>

                        <form onSubmit={onRegister} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50 text-slate-900"
                                    placeholder="John Doe"
                                />
                            </div>
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
                                <label className="text-sm font-medium text-slate-700">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50 text-slate-900"
                                    placeholder="Min 6 characters"
                                    required
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                             <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-11 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>{loadingMessages[loadingStep]}</span>
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </button>

                            <p className="text-xs text-slate-400 text-center leading-relaxed px-4">
                                By clicking "Create Account", you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </form>

                    </div>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
