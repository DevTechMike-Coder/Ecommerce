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
import { useEffect } from "react";

export default function AdminSignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/setup")
      .then(res => res.json())
      .then(data => {
          if (data.adminCount > 0) {
              router.push("/admin/login");
          }
      });
  }, [router]);

  const handleSetup = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, secret }),
      });
      const data = await res.json();
      
      if (res.ok) {
        const { error: signInError } = await authClient.signIn.email({
            email,
            password,
        });

        if (signInError) {
            alert(`Setup successful, but login failed: ${signInError.message || "Please sign in manually."}`);
            router.push("/admin/login");
        } else {
            alert("Success! You are now logged in as administrator.");
            router.push("/admin/product");
        }
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to complete setup");
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
            <span className="text-xs font-black tracking-widest uppercase text-primary">Initial Setup</span>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight uppercase">Admin Registration</CardTitle>
          <CardDescription className="text-muted-foreground">
            Register the primary administrator account (one-time operation).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <form className="space-y-4" onSubmit={handleSetup}>
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
              <Label htmlFor="name" className="text-sm font-semibold uppercase tracking-wide">Display Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="System Administrator"
                className="rounded-xl bg-secondary/20"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" title="password" className="text-sm font-semibold uppercase tracking-wide">
                  Password
              </Label>
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

            <div className="space-y-2">
              <Label htmlFor="secret" className="text-sm font-semibold uppercase tracking-wide">Setup Secret</Label>
              <Input
                id="secret"
                type="password"
                placeholder="Enter setup secret"
                className="rounded-xl bg-secondary/20"
                required
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-xl py-6 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]">
                {loading ? <Loader2 className="animate-spin" /> : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
