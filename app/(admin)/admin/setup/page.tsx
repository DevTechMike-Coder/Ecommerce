"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminSetupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/setup")
      .then(res => res.json())
      .then(data => setSetupComplete(data.setupComplete));
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Success! You are now an administrator.");
        router.push("/admin/product");
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

  if (setupComplete === null) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="animate-spin w-10 h-10 text-primary" />
          </div>
      );
  }

  if (setupComplete) {
    return (
      <main className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md border-border/50 shadow-xl rounded-[2rem] text-center p-8">
            <Lock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-2xl font-bold uppercase mb-2">Setup Restricted</CardTitle>
            <CardDescription className="text-muted-foreground mb-6">
                An administrator has already been registered. For security reasons, this setup page is now locked.
            </CardDescription>
            <Button onClick={() => router.push("/nextecommerce/signIn")} className="w-full rounded-xl">
                Return to Login
            </Button>
        </Card>
      </main>
    );
  }

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
            Register the primary administrator account. This is a one-time operation.
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
              <p className="text-[10px] text-muted-foreground">Use the email you&apos;ll use for sign-in.</p>
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

            <Button type="submit" disabled={loading} className="w-full rounded-xl py-6 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]">
              {loading ? <Loader2 className="animate-spin" /> : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
