import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="px-4 pb-14 pt-8 sm:px-6 sm:pt-12 md:pb-16 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-10 md:space-y-12">
        {/* Header Section */}
        <div className="flex flex-col gap-6 border-b border-border/40 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold tracking-wider uppercase text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Exploration</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-linear-to-r from-foreground to-foreground/60 bg-clip-text sm:text-5xl">
              NextHub
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Your central destination for the latest drops, exclusive
            collections, and premium shopping experiences.
          </p>
        </div>
      </div>
    </section>
  );
}
