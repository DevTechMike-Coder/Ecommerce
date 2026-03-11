import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function NewsLetter() {
  return (
    <section className="py-10 px-6">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold uppercase">NewsLetter</h1>
        <p className="text-center">
          Subscribe to our newsletter to get updates on our latest offers, you
          can unsubscribe at any time as described in Privacy Policy.
        </p>
      </div>

      <div className="mt-3">
        <form action="" className="flex items-center justify-center gap-3">
          <Input type="email" placeholder="Enter Your Email" className="w-60" />
          <Button>Suscribe</Button>
        </form>
      </div>
    </section>
  );
}
