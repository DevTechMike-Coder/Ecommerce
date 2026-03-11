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
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-20">
        {/* Dynamic Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />

        <div className="container mx-auto px-6 flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50 leading-tight">
              A Better Way <br /> to Shop
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
              Discover curated premium products from world-class brands,
              delivered directly to your doorstep with elegance.
            </p>
          </div>

          <div className="pt-4 drop-shadow-2xl">
            <Button
              size="lg"
              className="group relative px-8 py-6 h-auto rounded-full text-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link
                href="/nextecommerce/nextHub"
                className="flex items-center gap-3"
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
      <section className="w-full py-24 bg-secondary/30 border-y border-border/40">
        <div className="container mx-auto px-6 space-y-16">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Commitment
            </div>
            <h2 className="text-4xl font-bold tracking-tight">Our Policies</h2>
            <p className="text-muted-foreground max-w-md">
              We stand by our quality and service with industry-leading policies
              designed for your peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-background/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fair Exchanges</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Simple, transparent exchange process. If it&apos;s not perfect,
                we&apos;ll make it right within 30 days of purchase.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-background/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Reliable Delivery</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tracked, insured shipping on every order. We ensure your premium
                products arrive in pristine condition.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-background/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
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
      <section className="w-full py-24">
        <div className="container mx-auto px-6 max-w-3xl space-y-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <HelpCircle className="w-10 h-10 text-primary/40" />
            <h2 className="text-3xl font-bold tracking-tight">
              Got Questions?
            </h2>
          </div>

          <div className="p-2 rounded-[2rem] bg-secondary/20 border border-border/40 backdrop-blur-sm">
            <Accordion
              type="single"
              collapsible
              defaultValue="shipping"
              className="w-full px-6"
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
