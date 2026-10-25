import { Suspense } from "react";
import type { Metadata } from "next";
import { AccountPage } from "@/components/account/AccountPage";

export const metadata: Metadata = {
  title: "Twoje konto — Rêve",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="container max-w-7xl pb-24 pt-32">
      {/* Reads the return path from search params on the client */}
      <Suspense>
        <AccountPage />
      </Suspense>
    </div>
  );
}
