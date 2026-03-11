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
    <main className="pt-32 pb-20">
      <div className="px-6">
        <Button variant="outline" className="rounded-2xl">
          <Link
            href="/nextecommerce/signIn"
            className="flex items-center gap-2"
          >
            <ChevronLeft /> Return to Sign In
          </Link>
        </Button>
      </div>

      <div className="pt-12">
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl uppercase">Sign Up</CardTitle>
              <CardDescription>Create Your New Account</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      type="text"
                      placeholder="Enter your full name ..."
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email address ..."
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>

                      <Link href="/nextecommerce/forgotPassword" className="text-sm text-muted-foreground">
                        Forgot Password?
                      </Link>
                    </div>
                    <Input type="password" placeholder="********" required />
                  </div>

                  <div className="mt-3">
                    <Button type="submit" className="w-full">
                      Sign Up
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 m-4">
                  <Separator />
                  <p className="tracking-wider">OR</p>
                  <Separator />
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
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
