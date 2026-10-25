export default async function BookingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="mx-auto max-w-[1440px]">{children}</div>;
}
