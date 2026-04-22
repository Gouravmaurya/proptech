import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Haven",
  description:
    "Read Haven's Terms and Conditions — the rules governing your use of our AI-powered real estate platform. Clear, honest, and transparent.",
  alternates: { canonical: "/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
