import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function NewsLetter() {
  return (
    <section className="py-10 px-6">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold uppercase">NewsLetter</h1>
        <p className="text-center max-w-md text-muted-foreground">
          Subscribe to our newsletter to get updates on our latest offers, you
          can unsubscribe at any time as described in Privacy Policy.
        </p>
      </div>

      <div className="mt-5">
        <form
          action=""
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Enter Your Email"
            className="w-full sm:w-auto sm:flex-1"
          />
          <Button className="w-full sm:w-auto">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
