export default function Exclusive() {
  return (
    <section className="py-16 px-4 md:px-10 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-border/40 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            Limited Time
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Exclusive
          </h2>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          {[
            { label: "Days", value: "02" },
            { label: "Hours", value: "00" },
            { label: "Minutes", value: "00" },
            { label: "Seconds", value: "00" },
          ].map((unit, index, array) => (
            <div key={unit.label} className="flex items-center gap-4 md:gap-8">
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-black tabular-nums tracking-tight">
                  {unit.value}
                </span>
                <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase mt-1">
                  {unit.label}
                </span>
              </div>
              {index < array.length - 1 && (
                <div className="text-2xl md:text-4xl font-light text-primary/30 pb-4">:</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
