import { Button } from "@/components/ui/button";

export default function Orders() {
  return (
    <main className="px-10">
      <h1 className="text-4xl font-bold tracking-tight">Orders</h1>

      <div className="flex items-center justify-center gap-3">
        <Button className="rounded-2xl" variant="outline">
          All
        </Button>
        <Button className="rounded-2xl" variant="outline">
          Paid
        </Button>
        <Button className="rounded-2xl" variant="outline">
          Pending
        </Button>
        <Button className="rounded-2xl" variant="outline">
          Shipped
        </Button>
        <Button className="rounded-2xl" variant="outline">
          Delivered
        </Button>
        <Button className="rounded-2xl" variant="outline">
          Cancelled
        </Button>
      </div>
    </main>
  );
}
