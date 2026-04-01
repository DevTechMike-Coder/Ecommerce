export default function Exclusive() {
  return (
    <section className="mx-auto w-full max-w-7xl overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 border-b border-border/40 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            Limited Time
          </div>
          <h2 className="text-4xl font-black uppercase leading-none tracking-tighter sm:text-5xl md:text-7xl">
            Exclusive
          </h2>
        </div>

        <div className="grid w-full max-w-md grid-cols-4 gap-3 sm:flex sm:w-auto sm:max-w-none sm:items-center sm:gap-6 md:gap-8">
          {[
            { label: "Days", value: "02" },
            { label: "Hours", value: "00" },
            { label: "Minutes", value: "00" },
            { label: "Seconds", value: "00" },
          ].map((unit, index, array) => (
            <div key={unit.label} className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8">
              <div className="flex min-w-[2.5rem] flex-col items-center">
                <span className="text-2xl font-black tabular-nums tracking-tight sm:text-3xl md:text-5xl">
                  {unit.value}
                </span>
                <span className="mt-1 whitespace-nowrap text-[9px] font-bold uppercase text-muted-foreground sm:text-[10px] md:text-xs">
                  {unit.label}
                </span>
              </div>
              {index < array.length - 1 && (
                <div className="hidden pb-4 text-xl font-light text-primary/30 sm:block sm:text-2xl md:text-4xl">
                  :
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
