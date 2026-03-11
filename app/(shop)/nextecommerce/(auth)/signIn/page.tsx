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
    <main className="pt-32 pb-20">
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl uppercase">Sign In</CardTitle>
            <CardDescription>Sign In to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email address ..."
                    required
                  />
                </div>

                <div className="mt-3">
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 m-4">
                <Separator className="flex-1" />
                <p className="text-muted-foreground text-sm tracking-widest uppercase">
                  OR
                </p>
                <Separator className="flex-1" />
              </div>

              <div className="flex items-center gap-2.5">
                <Button className="w-50">
                  <Image
                    src="/assets/icons/google_2702602.png"
                    alt="google"
                    width={20}
                    height={20}
                  />
                  Google
                </Button>
                <Button className="w-50">
                  <Image
                    src="/assets/icons/github_1051326.png"
                    alt="github"
                    width={20}
                    height={20}
                  />
                  Github
                </Button>
              </div>
            </form>

            <div className="flex items-center justify-center mt-6">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/nextecommerce/signUp"
                  className="text-primary font-medium hover:underline transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
