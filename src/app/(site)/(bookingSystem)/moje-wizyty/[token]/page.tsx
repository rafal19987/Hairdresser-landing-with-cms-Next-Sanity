import type { Metadata } from "next";
import { ManageByLink } from "@/components/appointments/ManageByLink";
import { PageHeading } from "@/components/appointments/PageHeading";

// The token in the URL grants access to appointments, so it must not leak to search engines or other sites
export const metadata: Metadata = {
  title: "Twoje wizyty — Rêve",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function Page({ params }: { params: { token: string } }) {
  return (
    <div className="container max-w-7xl pb-24 pt-32">
      <PageHeading
        title="Twoje wizyty"
        description="Sprawdź zaplanowane wizyty, przełóż je lub anuluj."
      />
      <ManageByLink token={params.token} />
    </div>
  );
}
