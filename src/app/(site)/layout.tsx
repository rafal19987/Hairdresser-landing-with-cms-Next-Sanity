import { exo, robotoCondensed } from "@/fonts";
import "./globals.css";
import { Header } from "@/components/Header";
import { TailwindIndicator } from "@/components/TailwindIndicator";
import { Navigation } from "@/components/Navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={`${robotoCondensed.variable} ${exo.variable} antialiased`}
      >
        <Header>
          <Navigation />
        </Header>
        <main className="mx-auto max-w-7xl">{children}</main>
      </body>
      <TailwindIndicator />
    </html>
  );
}
