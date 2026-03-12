import { Button } from "@/components/ui/button";

export default function Orders() {
  return (
    <main className="px-4 md:px-10 py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight uppercase">Orders</h1>
      </div>

      <div className="flex flex-wrap items-center justify-start md:justify-center gap-3">
        <Button className="rounded-2xl whitespace-nowrap" variant="outline">
          All
        </Button>
        <Button className="rounded-2xl whitespace-nowrap" variant="outline">
          Paid
        </Button>
        <Button className="rounded-2xl whitespace-nowrap" variant="outline">
          Pending
        </Button>
        <Button className="rounded-2xl whitespace-nowrap" variant="outline">
          Shipped
        </Button>
        <Button className="rounded-2xl whitespace-nowrap" variant="outline">
          Delivered
        </Button>
        <Button className="rounded-2xl whitespace-nowrap" variant="outline">
          Cancelled
        </Button>
      </div>
    </main>
  );
}
