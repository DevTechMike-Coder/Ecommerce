import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ShieldCheck,
  Truck,
  RefreshCcw,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";



export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100svh-5rem)] w-full flex-col items-center justify-center px-4 pb-16 pt-4 sm:px-6 sm:pt-8 lg:px-8">
        {/* Dynamic Background Elements */}
        <div className="absolute left-[-4rem] top-[-2rem] h-56 w-56 rounded-full bg-primary/10 blur-[120px] -z-10 animate-pulse sm:h-[22rem] sm:w-[22rem]" />
        <div className="absolute bottom-[-3rem] right-[-4rem] h-56 w-56 rounded-full bg-primary/5 blur-[120px] -z-10 sm:h-[22rem] sm:w-[22rem]" />

        {/* Hero Section content revealed by global layout transition */}
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center space-y-8 text-center">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tighter text-transparent bg-linear-to-b from-foreground to-foreground/50 bg-clip-text sm:text-5xl md:text-6xl lg:text-7xl">
              A Better Way <br /> to Shop
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              Discover curated premium products from world-class brands,
              delivered directly to your doorstep with elegance.
            </p>
          </div>

          <div className="w-full max-w-sm pt-4 drop-shadow-2xl sm:w-auto sm:max-w-none">
            <Button
              size="lg"
              className="group relative h-auto w-full overflow-hidden rounded-full px-8 py-5 text-base font-semibold transition-all duration-300 hover:scale-105 sm:w-auto sm:text-lg"
              asChild
            >
              <Link
                href="/nextecommerce/nextHub"
                className="flex items-center justify-center gap-3"
              >
                <span className="relative z-10">Start Shopping</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
          </div>
        </div>

      </section>

      {/* Policies Section */}
      <section className="w-full border-y border-border/40 bg-secondary/30 px-4 py-20 sm:px-6 lg:px-8 md:py-24">
        <div className="mx-auto w-full max-w-7xl space-y-12 md:space-y-16">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Commitment
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Policies
            </h2>
            <p className="max-w-xl text-muted-foreground">
              We stand by our quality and service with industry-leading policies
              designed for your peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 lg:gap-8">
            <div className="group rounded-3xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fair Exchanges</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Simple, transparent exchange process. If it&apos;s not perfect,
                we&apos;ll make it right within 30 days of purchase.
              </p>
            </div>

            <div className="group rounded-3xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Reliable Delivery</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tracked, insured shipping on every order. We ensure your premium
                products arrive in pristine condition.
              </p>
            </div>

            <div className="group rounded-3xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 sm:p-8 sm:col-span-2 xl:col-span-1">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <RefreshCcw className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every item is strictly inspected. We only source from brands
                that share our commitment to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-4 py-20 sm:px-6 lg:px-8 md:py-24">
        <div className="mx-auto w-full max-w-3xl space-y-10 md:space-y-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <HelpCircle className="w-10 h-10 text-primary/40" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Got Questions?
            </h2>
          </div>

          <div className="rounded-[2rem] border border-border/40 bg-secondary/20 p-2 backdrop-blur-sm">
            <Accordion
              type="single"
              collapsible
              defaultValue="shipping"
              className="w-full px-4 sm:px-6"
            >
              <AccordionItem
                value="shipping"
                className="border-b-border/20 py-2"
              >
                <AccordionTrigger className="hover:no-underline font-semibold text-left">
                  What are your shipping options?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  We offer standard (5-7 days), express (2-3 days), and
                  overnight shipping. Free shipping on international orders
                  above $150.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="returns"
                className="border-b-border/20 py-2"
              >
                <AccordionTrigger className="hover:no-underline font-semibold text-left">
                  What is your return policy?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Returns accepted within 30 days. Items must be unused and in
                  original packaging. Refunds processed within 5-7 business
                  days.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="support" className="border-none py-2">
                <AccordionTrigger className="hover:no-underline font-semibold text-left">
                  How can I contact customer support?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Reach us via email, live chat, or phone. Our dedicated team is
                  available 24/7 to assist with your shopping journey.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  );
}
