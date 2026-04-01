import { Button } from "../ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserAccountNav } from "./UserAccountNav";

export default async function NavBar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">N</span>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-foreground sm:text-xl">
              Next Ecommerce
            </h1>
          </div>
        </Link>

        <div className="shrink-0">
          {user ? (
            <UserAccountNav user={user} />
          ) : (
            <Button
              variant="outline"
              className="rounded-full border-border/60 px-3 text-sm shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground sm:px-5"
              asChild
            >
              <Link href="/nextecommerce/signIn" className="font-medium">
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
