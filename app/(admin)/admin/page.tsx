export default function Admin() {
  return (
    <main className="px-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight uppercase">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-10 px-4 md:px-10">
        <div className="border border-border p-6 rounded-2xl bg-card transition-all hover:shadow-md">
          <h1 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Revenue</h1>
          <p className="text-2xl font-bold mt-2">$0000.00</p>
        </div>
        <div className="border border-border p-6 rounded-2xl bg-card transition-all hover:shadow-md">
          <h1 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sales</h1>
          <p className="text-2xl font-bold mt-2">+0</p>
        </div>
        <div className="border border-border p-6 rounded-2xl bg-card transition-all hover:shadow-md">
          <h1 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Customers</h1>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
        <div className="border border-border p-6 rounded-2xl bg-card transition-all hover:shadow-md">
          <h1 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Now</h1>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
      </div>
    </main>
  );
}
