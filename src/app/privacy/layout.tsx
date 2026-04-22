import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Haven",
  description:
    "Haven's Privacy Policy — what data we collect, how we use it, and how we protect it. We never sell your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
