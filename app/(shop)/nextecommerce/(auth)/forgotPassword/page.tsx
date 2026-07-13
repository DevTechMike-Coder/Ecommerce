"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/nextecommerce/resetPassword",
      });
      if (error) {
        toast.error(error.message ?? "Something went wrong");
      } else {
        setSent(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100svh-10rem)] items-center justify-center px-4 py-10 sm:min-h-[calc(100svh-9rem)] sm:px-6">
      <div className="flex w-full items-center justify-center">
        <Card className="w-full max-w-md overflow-hidden rounded-[2rem] border-border/50 shadow-xl">
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-extrabold tracking-tight uppercase sm:text-3xl">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground sm:text-base">
              Enter your email and we&apos;ll send you a reset link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-4 rounded-2xl bg-secondary/20 p-6 text-center"
                >
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    If an account exists for <span className="font-semibold text-foreground">{email}</span>,
                    a reset link is on its way. Check your inbox.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setSent(false)}
                  >
                    Use a different email
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                  onSubmit={handleSubmit}
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold uppercase tracking-wide">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-xl border-border/60 bg-secondary/20 pl-11 transition-all focus:bg-background"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl py-6 text-base font-bold shadow-lg transition-transform hover:scale-[1.02] sm:text-lg"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Remembered it after all?{" "}
                <Link
                  href="/nextecommerce/signIn"
                  className="font-bold text-primary underline decoration-2 underline-offset-4 transition-all hover:opacity-80"
                >
                  Back to Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
