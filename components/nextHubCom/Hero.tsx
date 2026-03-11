import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-6">
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold tracking-wider uppercase text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Exploration</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/60">
              NextHub
            </h1>
          </div>
          <p className="max-w-md text-muted-foreground leading-relaxed">
            Your central destination for the latest drops, exclusive
            collections, and premium shopping experiences.
          </p>
        </div>
      </div>
    </section>
  );
}
