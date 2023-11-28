export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">

    <section className="flex-1">
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav>Navu</nav>
      {children}
    </section>
    </div>
  )
}
