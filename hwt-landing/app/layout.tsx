export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Since we're using middleware to redirect to locale-specific pages,
  // this layout is just a passthrough
  return children
}
