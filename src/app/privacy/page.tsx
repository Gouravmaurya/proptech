"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Database,
  Eye,
  Share2,
  Lock,
  Cookie,
  UserCheck,
  Bell,
  Mail,
  RefreshCw,
  Globe,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const sections = [
  { id: "what-we-collect", icon: Database,  title: "Information We Collect" },
  { id: "how-we-use",      icon: Eye,       title: "How We Use Your Data" },
  { id: "sharing",         icon: Share2,    title: "Sharing & Disclosure" },
  { id: "security",        icon: Lock,      title: "Data Security" },
  { id: "cookies",         icon: Cookie,    title: "Cookies & Tracking" },
  { id: "your-rights",     icon: UserCheck, title: "Your Rights" },
  { id: "retention",       icon: RefreshCw, title: "Data Retention" },
  { id: "third-party",     icon: Globe,     title: "Third-Party Services" },
  { id: "children",        icon: Bell,      title: "Children's Privacy" },
  { id: "contact",         icon: Mail,      title: "Contact Us" },
];

/* ── Sidebar TOC ── */
function TOC({ active }: { active: string }) {
  return (
    <aside className="hidden xl:block w-64 flex-shrink-0">
      <div className="sticky top-28 space-y-3">
        <div className="bg-white border border-stone-200/70 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 mb-4">Contents</p>
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

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-emerald-800 mb-2">Our promise</p>
          <p className="text-xs text-emerald-700/80 leading-relaxed mb-3">
            We never sell your data. Ever.
          </p>
          <Link
            href="/terms"
            className="flex items-center justify-between text-sm text-emerald-700 hover:text-emerald-900 transition-colors group font-medium"
          >
            Terms & Conditions
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
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

function Bullets({ items, color = "emerald" }: { items: string[]; color?: "emerald" | "rose" }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${color === "rose" ? "bg-rose-400" : "bg-emerald-500"}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── Category mini-card ── */
function DataCard({
  icon: Icon, title, items, accent,
}: {
  icon: React.ElementType; title: string; items: string[];
  accent: { bg: string; border: string; icon: string; dot: string };
}) {
  return (
    <div className={`${accent.bg} ${accent.border} border rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${accent.icon}`} />
        <span className="text-sm font-semibold text-zinc-800">{title}</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} mt-1.5 flex-shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PrivacyPage() {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-teal-600/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-emerald-700/6 blur-[70px] rounded-full pointer-events-none" />

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
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-teal-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500">Legal</span>
            </div>

            <h1 className="font-heading text-5xl md:text-6xl text-white tracking-tight mb-4">
              Privacy{" "}
              <span className="text-emerald-400">Policy</span>
            </h1>
            <p className="text-zinc-400 font-light text-lg max-w-xl leading-relaxed mb-7">
              Your privacy matters deeply to us. This policy explains what data we collect, why we collect it, and how we protect it — in plain, honest language.
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Last updated: April 15, 2026
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5">
                <Shield className="w-3 h-3" />
                GDPR &amp; CCPA Aware
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5">
                <Lock className="w-3 h-3" />
                We never sell your data
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-14">
        <div className="flex gap-10">
          <div className="flex-1 min-w-0 space-y-4">

            {/* Commitment banner */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex gap-4 bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-900 mb-1">Our Commitment to You</p>
                <p className="text-sm text-emerald-800/80 leading-relaxed">
                  Haven is built on trust. We collect only what we need, protect it diligently, and never sell it.
                  This policy governs all personal data processed through our platform in accordance with GDPR, CCPA, and applicable privacy regulations.
                </p>
              </div>
            </motion.div>

            {/* Section 1 */}
            <Section id="what-we-collect" icon={Database} title="Information We Collect" index={0}>
              <p>We collect information to provide and continually improve the Haven experience. The data we gather falls into three categories:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <DataCard
                  icon={Database}
                  title="Account Data"
                  items={["Full name", "Email address", "Profile picture (OAuth)", "Authentication provider"]}
                  accent={{ bg: "bg-emerald-50", border: "border-emerald-100", icon: "text-emerald-700", dot: "bg-emerald-500" }}
                />
                <DataCard
                  icon={Eye}
                  title="Usage Data"
                  items={["Property searches & saves", "Pages visited", "Session duration", "Feature interactions"]}
                  accent={{ bg: "bg-blue-50", border: "border-blue-100", icon: "text-blue-700", dot: "bg-blue-500" }}
                />
                <DataCard
                  icon={Globe}
                  title="Technical Data"
                  items={["IP address", "Browser & version", "Device & OS", "Referring URLs"]}
                  accent={{ bg: "bg-amber-50", border: "border-amber-100", icon: "text-amber-700", dot: "bg-amber-500" }}
                />
              </div>
              <p>We use OAuth providers (Google and GitHub) for authentication. We do not store your OAuth passwords — only the tokens and profile data they provide.</p>
            </Section>

            {/* Section 2 */}
            <Section id="how-we-use" icon={Eye} title="How We Use Your Data" index={1}>
              <p>The data we collect is used exclusively to operate and improve Haven:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Service Delivery",   desc: "Authenticating you and enabling core platform features" },
                  { label: "Personalization",     desc: "Tailoring property recommendations to your investment profile" },
                  { label: "AI Improvement",      desc: "Training and refining our models using anonymized, aggregated data" },
                  { label: "Communications",      desc: "Sending important updates, alerts, and support responses" },
                  { label: "Security",            desc: "Detecting fraud, abuse, and unauthorized platform access" },
                  { label: "Analytics",           desc: "Understanding platform usage to guide product decisions" },
                ].map(({ label, desc }) => (
                  <div key={label} className="bg-stone-50 border border-stone-100 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">{label}</p>
                    <p className="text-sm text-stone-600">{desc}</p>
                  </div>
                ))}
              </div>
              <Note>We will never use your personal data for purposes beyond those stated here without obtaining your explicit consent first.</Note>
            </Section>

            {/* Section 3 */}
            <Section id="sharing" icon={Share2} title="Sharing & Disclosure" index={2}>
              <p className="font-semibold text-zinc-800">We do not sell, trade, or rent your personal information to any third party.</p>
              <p>We may share your data only in these limited circumstances:</p>
              <ul className="space-y-3">
                {[
                  { title: "Service Providers",   desc: "Trusted vendors (database hosting, analytics, email delivery) who process data strictly on our behalf under confidentiality agreements." },
                  { title: "Legal Compliance",    desc: "When required by law, court order, or governmental regulation. We will notify you when legally permitted." },
                  { title: "Business Transfers",  desc: "In the event of a merger, acquisition, or asset sale — subject to continued privacy protections for your data." },
                  { title: "With Your Consent",   desc: "Any other sharing only occurs with your explicit, informed consent." },
                ].map(({ title, desc }) => (
                  <li key={title} className="flex items-start gap-3 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <span><strong className="text-zinc-800 font-semibold">{title}: </strong>{desc}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Section 4 */}
            <Section id="security" icon={Lock} title="Data Security" index={3}>
              <p>We implement industry-standard technical and organizational measures to protect your personal information:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: "🔐", title: "Encryption",      desc: "All data transmitted over TLS 1.3. Data at rest encrypted using AES-256." },
                  { icon: "🛡️", title: "Access Control",  desc: "Role-based access with principle of least privilege for all internal systems." },
                  { icon: "🔍", title: "Monitoring",      desc: "Automated monitoring for suspicious activity and anomalies." },
                  { icon: "🔄", title: "Regular Audits",  desc: "Periodic security reviews and penetration testing of our infrastructure." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="border border-stone-200 rounded-xl p-4 flex gap-3">
                    <span className="text-xl leading-none mt-0.5">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-800 mb-1">{title}</p>
                      <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p>No method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.</p>
            </Section>

            {/* Section 5 */}
            <Section id="cookies" icon={Cookie} title="Cookies & Tracking" index={4}>
              <p>Haven uses cookies and similar tracking technologies to maintain your session and understand platform usage.</p>
              <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                {[
                  { type: "Essential", purpose: "Required for authentication and core platform functionality. Cannot be disabled.", optional: false },
                  { type: "Analytics", purpose: "Help us understand how users interact with Haven (anonymized). Privacy-respecting tools only.", optional: true },
                  { type: "Preferences", purpose: "Remember your settings, saved searches, and display preferences.", optional: true },
                ].map(({ type, purpose, optional }) => (
                  <div key={type} className="flex flex-col sm:flex-row">
                    <div className="sm:w-32 flex-shrink-0 px-4 py-3 bg-stone-50 border-b sm:border-b-0 sm:border-r border-stone-100 flex items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">{type}</span>
                    </div>
                    <div className="px-4 py-3 text-sm text-stone-600 flex-1">{purpose}</div>
                    <div className="px-4 py-3 sm:w-28 flex-shrink-0 flex items-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${optional ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                        {optional ? "Opt-out" : "Required"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Section 6 */}
            <Section id="your-rights" icon={UserCheck} title="Your Rights" index={5}>
              <p>Depending on your location, you have the following rights regarding your personal data:</p>
              <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                {[
                  { right: "Access",       desc: "Request a copy of all personal data we hold about you in a portable format." },
                  { right: "Rectification", desc: "Request correction of inaccurate or incomplete personal data." },
                  { right: "Erasure",      desc: "Request deletion of your personal data ('right to be forgotten') where legally applicable." },
                  { right: "Restriction",  desc: "Request that we limit the processing of your data in certain circumstances." },
                  { right: "Portability",  desc: "Receive your data in a structured, machine-readable format." },
                  { right: "Objection",    desc: "Object to processing of your data for direct marketing or legitimate interests." },
                ].map(({ right, desc }) => (
                  <div key={right} className="flex flex-col sm:flex-row">
                    <div className="sm:w-36 flex-shrink-0 px-4 py-3 bg-stone-50 border-b sm:border-b-0 sm:border-r border-stone-100 flex items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">{right}</span>
                    </div>
                    <div className="px-4 py-3 text-sm text-stone-600">{desc}</div>
                  </div>
                ))}
              </div>
              <Note>
                To exercise any of these rights, email{" "}
                <a href="mailto:privacy@haven.ai" className="text-emerald-700 underline underline-offset-2 font-medium hover:text-emerald-900">
                  privacy@haven.ai
                </a>
                . We respond to all requests within 30 days.
              </Note>
            </Section>

            {/* Section 7 */}
            <Section id="retention" icon={RefreshCw} title="Data Retention" index={6}>
              <p>We retain your personal data only as long as necessary to provide our services:</p>
              <Bullets items={[
                "Active account data: retained for the duration of your account",
                "Usage and analytics data: retained for 24 months, then anonymized",
                "Support communications: retained for 12 months after case closure",
                "Legal compliance records: retained as required by applicable law",
              ]} />
              <p>Upon account deletion, your personal data is removed from our active systems within 30 days. Some data may remain in encrypted backups for up to 90 days before permanent deletion.</p>
            </Section>

            {/* Section 8 */}
            <Section id="third-party" icon={Globe} title="Third-Party Services" index={7}>
              <p>Haven integrates with reputable third-party services to operate efficiently. Each maintains their own privacy policies:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: "Google OAuth", role: "Authentication" },
                  { name: "GitHub OAuth", role: "Authentication" },
                  { name: "Vercel",       role: "Hosting & CDN" },
                  { name: "Neon / Prisma", role: "Database" },
                ].map(({ name, role }) => (
                  <div key={name} className="border border-stone-200 rounded-xl p-3 text-center">
                    <p className="text-sm font-semibold text-zinc-800">{name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{role}</p>
                  </div>
                ))}
              </div>
              <p>Haven is not responsible for the privacy practices of these third-party services. We recommend reviewing their respective privacy policies.</p>
            </Section>

            {/* Section 9 */}
            <Section id="children" icon={Bell} title="Children's Privacy" index={8}>
              <p>Haven is not intended for use by children under the age of 16. We do not knowingly collect personal information from children under 16.</p>
              <p>If we become aware that we have inadvertently collected data from a child under 16 without verified parental consent, we will immediately delete that information.</p>
              <p>If you are a parent or guardian and believe your child has provided us personal information, please contact{" "}
                <a href="mailto:privacy@haven.ai" className="text-emerald-700 underline underline-offset-2 font-medium hover:text-emerald-900">
                  privacy@haven.ai
                </a>.
              </p>
            </Section>

            {/* Section 10 */}
            <Section id="contact" icon={Mail} title="Contact Us" index={9}>
              <p>For any questions or requests relating to this Privacy Policy, please reach out to our dedicated privacy team:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Privacy Team",   email: "privacy@haven.ai" },
                  { label: "Data Requests",  email: "data@haven.ai" },
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
              <p className="text-sm">We are committed to resolving your concerns within <strong className="text-zinc-800">30 days</strong>.</p>
            </Section>

            {/* Bottom nav */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-zinc-900 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Home
              </Link>
              <Link href="/terms" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">
                Read Terms & Conditions →
              </Link>
            </div>
          </div>

          <TOC active={active} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
