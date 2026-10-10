import type { Metadata } from "next";

import "./index.css";

export const metadata: Metadata = {
  title: "Krishna · Index",
  description:
    "Founding AI/ML engineer. I ship AI that does real work, from the agent loop to the last pixel.",
};

export default function IndexLayout({ children }: { children: React.ReactNode }) {
  return children;
}
