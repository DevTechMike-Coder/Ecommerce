"use client";

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
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Successfully signed in!");
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <main className="flex min-h-[calc(100svh-10rem)] items-center justify-center px-4 py-10 sm:min-h-[calc(100svh-9rem)] sm:px-6">
      <div className="flex w-full items-center justify-center">
        <Card className="w-full max-w-md border-border/50 shadow-xl overflow-hidden rounded-[2rem]">
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-extrabold tracking-tight uppercase sm:text-3xl">
              Sign In
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground sm:text-base">
              Access your account to continue shopping
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <form className="space-y-4" onSubmit={handleSignIn}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold tracking-wide uppercase">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="rounded-xl border-border/60 bg-secondary/20 focus:bg-background transition-all"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" title="password" className="text-sm font-semibold tracking-wide uppercase">Password</Label>
                  <Link
                    href="/nextecommerce/forgotPassword"
                    className="text-xs font-semibold text-primary underline decoration-2 underline-offset-4 transition-all hover:opacity-80"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="rounded-xl border-border/60 bg-secondary/20 focus:bg-background transition-all"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-xl py-6 text-base font-bold shadow-lg transition-transform hover:scale-[1.02] sm:text-lg">
                {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
              </Button>

              <div className="flex items-center gap-4 py-2">
                <Separator className="flex-1 opacity-50" />
                <span className="text-[10px] font-black text-muted-foreground/60 tracking-[0.2em] uppercase">
                  Secure Connect
                </span>
                <Separator className="flex-1 opacity-50" />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex-1 w-full rounded-xl py-6 flex items-center justify-center gap-3 border-border/60 hover:bg-secondary/40 transition-all">
                  <Image
                    src="/assets/icons/google_2702602.png"
                    alt="google"
                    width={20}
                    height={20}
                  />
                  <span className="font-semibold">Google</span>
                </Button>
                <Button variant="outline" type="button" className="flex-1 w-full rounded-xl py-6 flex items-center justify-center gap-3 border-border/60 hover:bg-secondary/40 transition-all">
                  <Image
                    src="/assets/icons/facebook_3128304.png"
                    alt="facebook"
                    width={20}
                    height={20}
                  />
                  <span className="font-semibold">Facebook</span>
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
