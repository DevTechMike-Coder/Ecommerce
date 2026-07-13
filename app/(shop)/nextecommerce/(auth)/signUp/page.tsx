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
import { ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/nextecommerce/signIn",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Account created successfully!");
      router.push("/nextecommerce/signIn");
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
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button asChild variant="ghost" className="flex items-center gap-2 rounded-full text-muted-foreground transition-all hover:bg-secondary/60 hover:text-foreground">
            <Link href="/nextecommerce/signIn">
              <ChevronLeft size={18} />
              <span className="text-sm font-medium">Return to Sign In</span>
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md overflow-hidden rounded-[2rem] border-border/50 shadow-xl">
            <CardHeader className="space-y-1 pt-8">
              <CardTitle className="text-2xl font-extrabold tracking-tight uppercase sm:text-3xl">
                Sign Up
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground sm:text-base">
                Join our premium community today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <form className="space-y-4" onSubmit={handleSignUp}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold tracking-wide uppercase">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="rounded-xl border-border/60 bg-secondary/20 focus:bg-background transition-all"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-xl py-6 text-base font-bold shadow-lg transition-transform hover:scale-[1.02] sm:text-lg">
                {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
              </Button>

              <div className="flex items-center gap-4 py-2">
                <Separator className="flex-1 opacity-50" />
                <span className="text-[10px] font-black text-muted-foreground/60 tracking-[0.2em] uppercase">
                  Social Signup
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
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
