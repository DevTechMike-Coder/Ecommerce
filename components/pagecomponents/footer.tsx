import Image from "next/image";
import { Separator } from "../ui/separator";

export default function Footer() {
  return (
    <footer className="w-full pt-20 pb-12 bg-background/60 backdrop-blur-xl border-t border-border/40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  N
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                Next Ecommerce
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-sm leading-relaxed">
              Your premium destination for curated excellence. Discover brands
              that define your lifestyle.
            </p>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80">
                Company
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  About Us
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Careers
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Press
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Investors
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80">
                Support
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Help Center
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Shipping
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Returns
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Contact
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80">
                Legal
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Privacy
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Terms
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Cookie Policy
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        <div className="grid grid-cols-1 gap-8 pt-12 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:items-start">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/95">
                Follow Us
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  {
                    name: "facebook",
                    src: "/assets/icons/icons8-facebook-logo-100.png",
                  },
                  {
                    name: "instagram",
                    src: "/assets/icons/icons8-instagram-logo-100.png",
                  },
                  { name: "x", src: "/assets/icons/icons8-x-logo-100.png" },
                ].map((social) => (
                  <div
                    key={social.name}
                    className="w-9 h-9 rounded-xl bg-secondary/50 border border-border/40 flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all group cursor-pointer"
                  >
                    <Image
                      src={social.src}
                      alt={social.name}
                      width={18}
                      height={18}
                      className="opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/95">
                Payment Methods
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  {
                    name: "mastercard",
                    src: "/assets/icons/assets_10693288.png",
                  },
                  { name: "card", src: "/assets/icons/card_11378185.png" },
                  { name: "visa", src: "/assets/icons/icons8-visa-100.png" },
                ].map((payment) => (
                  <div
                    key={payment.name}
                    className="h-8 px-2 rounded-lg bg-background/40 border border-border/40 flex items-center justify-center"
                  >
                    <Image
                      src={payment.src}
                      alt={payment.name}
                      width={32}
                      height={20}
                      className="opacity-80 grayscale hover:grayscale-0 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:text-right">
            <p className="max-w-sm text-sm text-muted-foreground/60 md:ml-auto">
              &copy; 2026 Next Ecommerce. Designed for the modern shopper.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
