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
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  return (
    <main className="pt-10 md:pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto mb-8">
        <Link href="/nextecommerce/signIn">
          <Button variant="ghost" className="rounded-full hover:bg-secondary/60 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all">
            <ChevronLeft size={18} /> 
            <span className="text-sm font-medium">Return to Sign In</span>
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md border-border/50 shadow-xl overflow-hidden rounded-[2rem]">
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-3xl font-extrabold tracking-tight uppercase">Sign Up</CardTitle>
            <CardDescription className="text-muted-foreground">Join our premium community today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold tracking-wide uppercase">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="rounded-xl border-border/60 bg-secondary/20 focus:bg-background transition-all"
                  required
                />
              </div>

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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" title="password" className="text-sm font-semibold tracking-wide uppercase">Password</Label>
                  <Link
                    href="/nextecommerce/forgotPassword"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors mt-[-2px]"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="rounded-xl border-border/60 bg-secondary/20 focus:bg-background transition-all"
                  required 
                />
              </div>

              <Button type="submit" className="w-full rounded-xl py-6 text-lg font-bold shadow-lg hover:scale-[1.02] transition-transform">
                Create Account
              </Button>

              <div className="flex items-center gap-4 py-2">
                <Separator className="flex-1 opacity-50" />
                <span className="text-[10px] font-black text-muted-foreground/60 tracking-[0.2em] uppercase">
                  Social Signup
                </span>
                <Separator className="flex-1 opacity-50" />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button variant="outline" type="button" className="w-full rounded-xl py-6 flex items-center justify-center gap-3 border-border/60 hover:bg-secondary/40 transition-all">
                  <Image
                    src="/assets/icons/google_2702602.png"
                    alt="google"
                    width={20}
                    height={20}
                  />
                  <span className="font-semibold">Google</span>
                </Button>
                <Button variant="outline" type="button" className="w-full rounded-xl py-6 flex items-center justify-center gap-3 border-border/60 hover:bg-secondary/40 transition-all">
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
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
