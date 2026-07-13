import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function NewsLetter() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center rounded-[2rem] border border-border/40 bg-secondary/20 px-5 py-10 text-center shadow-sm sm:px-8 sm:py-12">
        <h1 className="text-3xl font-bold uppercase sm:text-4xl">NewsLetter</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Subscribe to our newsletter to get updates on our latest offers. You
          can unsubscribe at any time as described in our Privacy Policy.
        </p>

        <div className="mt-6 w-full">
          <form
            action=""
            className="mx-auto flex w-full max-w-2xl flex-col items-stretch justify-center gap-3 sm:flex-row"
          >
            <Input
              type="email"
              placeholder="Enter Your Email"
              className="h-12 w-full rounded-full bg-background"
            />
            <Button className="h-12 w-full rounded-full px-6 sm:w-auto">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
