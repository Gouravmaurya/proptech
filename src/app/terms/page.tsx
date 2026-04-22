"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Shield,
  User,
  Lock,
  BookOpen,
  AlertTriangle,
  RefreshCw,
  Scale,
  Globe,
  Mail,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const sections = [
  { id: "acceptance",     icon: FileText,      title: "Acceptance of Terms" },
  { id: "description",    icon: BookOpen,      title: "Description of Service" },
  { id: "accounts",       icon: User,          title: "User Accounts" },
  { id: "acceptable-use", icon: Shield,        title: "Acceptable Use" },
  { id: "privacy",        icon: Lock,          title: "Data & Privacy" },
  { id: "intellectual",   icon: Globe,         title: "Intellectual Property" },
  { id: "disclaimers",    icon: AlertTriangle, title: "Disclaimers" },
  { id: "liability",      icon: Scale,         title: "Limitation of Liability" },
  { id: "changes",        icon: RefreshCw,     title: "Changes to Terms" },
  { id: "contact",        icon: Mail,          title: "Contact Us" },
];

/* ── Sidebar TOC ── */
function TOC({ active }: { active: string }) {
  return (
    <aside className="hidden xl:block w-64 flex-shrink-0">
      <div className="sticky top-28 space-y-3">
        <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 mb-4">
            Contents
          </p>
          <nav className="space-y-0.5">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-stone-500 hover:text-zinc-800 hover:bg-stone-50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-emerald-600" : "text-stone-400"}`} />
                  <span className="leading-tight">{s.title}</span>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
                </a>
              );
            })}
          </nav>
        </div>

        <Link
          href="/privacy"
          className="flex items-center justify-between px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm text-emerald-700 hover:bg-emerald-100 transition-colors group"
        >
          <span className="font-medium">Privacy Policy</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </aside>
  );
}

/* ── Section Card ── */
function Section({
  id, icon: Icon, title, index, children,
}: {
  id: string; icon: React.ElementType; title: string; index: number; children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-28 bg-white border border-stone-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-stone-300/60 transition-all duration-300"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 mb-0.5">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">{title}</h2>
        </div>
      </div>
      <div className="space-y-4 text-[15px] text-stone-600 leading-relaxed pl-14">
        {children}
      </div>
    </motion.section>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-900 leading-relaxed">
      {children}
    </div>
  );
}

function Warn({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-900 leading-relaxed">
      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

function Bullets({ items, color = "emerald" }: { items: string[]; color?: "emerald" | "rose" | "amber" }) {
  const dot: Record<string, string> = {
    emerald: "bg-emerald-500",
    rose: "bg-rose-400",
    amber: "bg-amber-500",
  };
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dot[color]} mt-2 flex-shrink-0`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  const [active, setActive] = useState(sections[0].id);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", () => {
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el && el.getBoundingClientRect().top <= 160) {
        setActive(sections[i].id);
        break;
      }
    }
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <Header />

      {/* ── Hero ── */}
      <div className="relative bg-zinc-950 overflow-hidden pt-32 pb-20 px-6">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-emerald-600/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-400 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </Link>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">Legal</span>
            </div>

            <h1 className="font-heading text-5xl md:text-6xl text-white tracking-tight mb-4">
              Terms &{" "}
              <span className="text-emerald-400">Conditions</span>
            </h1>
            <p className="text-zinc-400 font-light text-lg max-w-xl leading-relaxed mb-7">
              Please read these terms carefully before using Haven. By accessing our platform, you agree to be bound by the conditions below.
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Last updated: April 15, 2026
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5">
                <FileText className="w-3 h-3" />
                {sections.length} Sections
              </span>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 hover:bg-emerald-500/20 transition-colors"
              >
                <Lock className="w-3 h-3" />
                Privacy Policy →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-14">
        <div className="flex gap-10">
          {/* Sections */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Notice banner */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex gap-4 bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-900 mb-1">Before You Begin</p>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  These Terms and Conditions form a legally binding agreement between you and Haven.
                  If you do not agree with any part, please discontinue use of our services immediately.
                </p>
              </div>
            </motion.div>

            <Section id="acceptance" icon={FileText} title="Acceptance of Terms" index={0}>
              <p>By accessing, browsing, or using the Haven platform ("the Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and all applicable laws and regulations.</p>
              <p>If you are using Haven on behalf of an organization, you represent that you have the authority to bind that entity to these Terms.</p>
              <Note>Your continued use of Haven after any modifications constitutes your acceptance of those changes. Review this page periodically.</Note>
            </Section>

            <Section id="description" icon={BookOpen} title="Description of Service" index={1}>
              <p>Haven is an AI-powered real estate intelligence platform providing property discovery, investment analysis, ROI projections, market insights, and virtual staging tools — designed to help investors make more informed real estate decisions.</p>
              <p>Our platform includes:</p>
              <Bullets items={[
                "AI-driven property search and matching",
                "Investment return calculators and ROI projections",
                "Market trend analysis and data aggregation",
                "Virtual staging and property visualization tools",
                "Scout agent for automated deal discovery",
              ]} />
              <Warn>All AI-generated insights are for informational purposes only and do not constitute professional financial, legal, or real estate advice. Always consult qualified professionals before making investment decisions.</Warn>
            </Section>

            <Section id="accounts" icon={User} title="User Accounts" index={2}>
              <p>To access certain features, you must create an account via supported OAuth providers (Google, GitHub) or directly through our platform. By creating an account, you agree to:</p>
              <Bullets items={[
                "Provide accurate, current, and complete registration information",
                "Maintain the security and confidentiality of your login credentials",
                "Notify us immediately of any unauthorized access or breach",
                "Accept responsibility for all activities conducted under your account",
                "Not share your account credentials with any third party",
              ]} />
              <p>Haven reserves the right to suspend or terminate accounts that violate these Terms.</p>
            </Section>

            <Section id="acceptable-use" icon={Shield} title="Acceptable Use" index={3}>
              <p>You agree to use Haven only for lawful purposes. You must not:</p>
              <Bullets color="rose" items={[
                "Violate any applicable local, national, or international law or regulation",
                "Transmit unauthorized advertising or promotional material",
                "Impersonate any person or entity, or falsely represent your affiliation",
                "Engage in data mining, scraping, or systematic extraction of platform data",
                "Attempt to gain unauthorized access to any part of the Service or its systems",
                "Introduce viruses, malware, or other harmful code",
                "Interfere with or disrupt the integrity or performance of the platform",
              ]} />
              <Warn>Violation of these policies may result in immediate account termination and could lead to legal action.</Warn>
            </Section>

            <Section id="privacy" icon={Lock} title="Data & Privacy" index={4}>
              <p>Your privacy is paramount to us. Our Privacy Policy governs the collection, use, and disclosure of your personal information and is incorporated into these Terms by reference.</p>
              <Note>
                By using Haven, you consent to data processing as described in our{" "}
                <Link href="/privacy" className="text-emerald-700 underline underline-offset-2 font-medium hover:text-emerald-900">Privacy Policy</Link>.
                We use anonymized, aggregated data to improve our AI models and platform experience.
              </Note>
            </Section>

            <Section id="intellectual" icon={Globe} title="Intellectual Property" index={5}>
              <p>The Service and its original content, features, functionality, design, logos, trademarks, and AI models are the exclusive property of Haven and its licensors, protected by copyright and intellectual property laws.</p>
              <p>You may not:</p>
              <Bullets items={[
                "Reproduce, duplicate, copy, or sell any portion of the Service",
                "Reverse-engineer or extract source code from Haven's systems",
                "Create derivative works based on our platform or AI models",
                "Use Haven's branding or trademarks without prior written consent",
              ]} />
            </Section>

            <Section id="disclaimers" icon={AlertTriangle} title="Disclaimers" index={6}>
              <p>Haven provides the Service on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, either express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
              <Warn>We do not warrant that the Service will be uninterrupted or error-free. Real estate market data and AI-generated projections are subject to change and may not always be accurate. Past performance is not a reliable predictor of future results.</Warn>
            </Section>

            <Section id="liability" icon={Scale} title="Limitation of Liability" index={7}>
              <p>To the maximum extent permitted by law, Haven and its directors, employees, partners, agents, and affiliates shall not be liable for:</p>
              <Bullets color="amber" items={[
                "Any indirect, incidental, special, consequential, or punitive damages",
                "Loss of profits, revenue, data, goodwill, or other intangible losses",
                "Damages from your use of or inability to use the Service",
                "Unauthorized access to or alteration of your data",
                "Any investment losses or financial decisions based on platform data",
              ]} />
              <Note>In no event shall Haven's total liability exceed the amount you have paid Haven in the twelve (12) months prior to the claim.</Note>
            </Section>

            <Section id="changes" icon={RefreshCw} title="Changes to Terms" index={8}>
              <p>Haven reserves the right to modify these Terms at any time. We will notify you of significant changes by:</p>
              <Bullets items={[
                "Updating the 'Last updated' date at the top of this page",
                "Sending an email notification to your registered address",
                "Displaying a prominent notice within the platform interface",
              ]} />
              <p>Continued use of Haven after changes constitutes your acceptance of the new Terms. If you disagree, you must discontinue use of Haven.</p>
            </Section>

            <Section id="contact" icon={Mail} title="Contact Us" index={9}>
              <p>For any questions or concerns about these Terms, please reach out to our team:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "General Inquiries", email: "hello@haven.ai" },
                  { label: "Legal Department",  email: "legal@haven.ai" },
                ].map(({ label, email }) => (
                  <a
                    key={label}
                    href={`mailto:${email}`}
                    className="flex flex-col gap-1 p-4 rounded-xl border border-stone-200 hover:border-emerald-200 hover:bg-emerald-50/60 transition-all duration-200 group"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-emerald-600">{label}</span>
                    <span className="text-sm font-medium text-zinc-800 group-hover:text-emerald-700">{email}</span>
                  </a>
                ))}
              </div>
            </Section>

            {/* Bottom nav */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-zinc-900 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Home
              </Link>
              <Link href="/privacy" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">
                Read Privacy Policy →
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <TOC active={active} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
