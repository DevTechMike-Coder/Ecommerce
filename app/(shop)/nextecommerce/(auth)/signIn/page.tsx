import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export default function SignIn() {
  return (
    <main className="pt-10 md:pt-32 pb-20 px-4">
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md border-border/50 shadow-xl overflow-hidden rounded-[2rem]">
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-3xl font-extrabold tracking-tight uppercase">Sign In</CardTitle>
            <CardDescription className="text-muted-foreground">Access your account to continue shopping</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold tracking-wide uppercase">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="rounded-xl border-border/60 bg-secondary/20 focus:bg-background transition-all"
                  required
                />
              </div>

              <Button type="submit" className="w-full rounded-xl py-6 text-lg font-bold shadow-lg hover:scale-[1.02] transition-transform">
                Sign In
              </Button>

              <div className="flex items-center gap-4 py-2">
                <Separator className="flex-1 opacity-50" />
                <span className="text-[10px] font-black text-muted-foreground/60 tracking-[0.2em] uppercase">
                  Secure Connect
                </span>
                <Separator className="flex-1 opacity-50" />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button variant="outline" className="flex-1 w-full rounded-xl py-6 flex items-center justify-center gap-3 border-border/60 hover:bg-secondary/40 transition-all">
                  <Image
                    src="/assets/icons/google_2702602.png"
                    alt="google"
                    width={20}
                    height={20}
                  />
                  <span className="font-semibold">Google</span>
                </Button>
                <Button variant="outline" className="flex-1 w-full rounded-xl py-6 flex items-center justify-center gap-3 border-border/60 hover:bg-secondary/40 transition-all">
                  <Image
                    src="/assets/icons/github_1051326.png"
                    alt="github"
                    width={20}
                    height={20}
                  />
                  <span className="font-semibold">Github</span>
                </Button>
              </div>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                New to Next Ecommerce?{" "}
                <Link
                  href="/nextecommerce/signUp"
                  className="text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
