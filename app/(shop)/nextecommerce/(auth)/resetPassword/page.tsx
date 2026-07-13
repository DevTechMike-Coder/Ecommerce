"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ShieldAlert } from "lucide-react";
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

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const resetError = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("This reset link is missing or malformed.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (error) {
        toast.error(error.message ?? "This reset link may have expired.");
      } else {
        toast.success("Password updated. Sign in with your new password.");
        router.push("/nextecommerce/signIn");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const invalidLink = !token || resetError === "invalid_token" || resetError === "INVALID_TOKEN";

  return (
    <main className="flex min-h-[calc(100svh-10rem)] items-center justify-center px-4 py-10 sm:min-h-[calc(100svh-9rem)] sm:px-6">
      <div className="flex w-full items-center justify-center">
        <Card className="w-full max-w-md overflow-hidden rounded-[2rem] border-border/50 shadow-xl">
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-extrabold tracking-tight uppercase sm:text-3xl">
              Reset Password
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground sm:text-base">
              Choose a new password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            {invalidLink ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-4 rounded-2xl bg-destructive/10 p-6 text-center"
              >
                <ShieldAlert className="h-10 w-10 text-destructive" />
                <p className="text-sm text-muted-foreground">
                  This reset link is invalid or has expired. Request a new one to continue.
                </p>
                <Button asChild className="rounded-xl">
                  <Link href="/nextecommerce/forgotPassword">Request New Link</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold uppercase tracking-wide">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl border-border/60 bg-secondary/20 transition-all focus:bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold uppercase tracking-wide">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl border-border/60 bg-secondary/20 transition-all focus:bg-background"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-6 text-base font-bold shadow-lg transition-transform hover:scale-[1.02] sm:text-lg"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
                </Button>
              </motion.form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
