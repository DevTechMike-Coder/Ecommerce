"use client";

import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    fetch("/api/admin/setup")
      .then(res => res.json())
      .then(data => {
          if (data.adminCount === 0) {
              router.push("/admin/signup");
          }
      });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);
    try {
        const { error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) {
            alert(error.message || "Invalid credentials");
        } else {
            router.push("/admin/product");
            router.refresh();
        }
    } catch (err) {
        console.error(err);
        alert("Login failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-neutral-50/50">
      <Card className="w-full max-w-md border-border/50 shadow-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="space-y-1 pt-8">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="text-xs font-black tracking-widest uppercase text-primary">Admin Access</span>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight uppercase">Administrator Login</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access the administrator dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold uppercase tracking-wide">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className="rounded-xl bg-secondary/20"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" title="password" className="text-sm font-semibold uppercase tracking-wide">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="rounded-xl bg-secondary/20"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-xl py-6 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]">
                {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
