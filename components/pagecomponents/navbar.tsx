import { User2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-background/60 border-b border-border/40 transition-all duration-300">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">N</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
            Next Ecommerce
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50 hover:bg-secondary/80 transition-colors">
          <p className="text-xs font-medium">AdminUser</p>
          <User2 size={16} className="text-muted-foreground" />
        </div>

        <Button
          variant="outline"
          className="rounded-full px-5 border-border/60 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
          asChild
        >
          <Link href="/nextecommerce/signIn" className="font-medium">
            Sign In
          </Link>
        </Button>
      </div>
    </nav>
  );
}
