export default function SpecialUserOffers() {
  return (
    <section className="flex flex-col gap-10 bg-neutral-50/50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase bg-linear-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent">
          Special User Offers
        </h1>
        <p className="text-base text-neutral-500 font-medium max-w-md">
          Have Your Own Products You Want To Sell? Join our premium plans to
          maximize your reach.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        {/* NextHub Silver */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:p-8">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150 opacity-50" />

          <div className="relative space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight uppercase text-slate-800">
                NextHub Silver
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Get more access to new and powerful features to boost your
                productivity and creativity.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-4xl font-black tracking-tighter text-slate-900 sm:text-5xl">
                $100
                <span className="text-sm font-semibold text-slate-400 ml-1 tracking-wide">
                  / 2 Month
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button className="w-full py-3 px-6 rounded-xl bg-slate-900 text-white font-semibold transition-all duration-300 hover:bg-slate-800 hover:shadow-lg active:scale-95">
              Choose Silver
            </button>
          </div>
        </div>

        {/* NextHub Gold */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-amber-200 bg-white p-6 ring-4 ring-amber-50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(251,191,36,0.1)] sm:p-8">
          <div className="absolute top-0 right-0 bg-amber-400 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-widest z-10">
            Most Popular
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150 opacity-60" />

          <div className="relative space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight uppercase text-amber-900">
                NextHub Gold
              </h2>
              <p className="text-sm text-amber-700/70 leading-relaxed">
                Unlock advanced tools and priority support to take your business
                to the next level.
              </p>
            </div>

            <div className="pt-4 border-t border-amber-100">
              <p className="text-4xl font-black tracking-tighter text-amber-600 sm:text-5xl">
                $100
                <span className="text-sm font-semibold text-amber-400 ml-1 tracking-wide">
                  / 5 Month
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button className="w-full py-3 px-6 rounded-xl bg-amber-500 text-white font-semibold transition-all duration-300 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-200 active:scale-95">
              Get Gold Access
            </button>
          </div>
        </div>

        {/* NextHub Platinum */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-indigo-200 bg-white/70 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(79,70,229,0.08)] sm:p-8">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150 opacity-50" />

          <div className="relative space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight uppercase text-indigo-900">
                NextHub Platinum
              </h2>
              <p className="text-sm text-indigo-500 leading-relaxed">
                The ultimate experience with full platform access and unlimited
                possibilities for growth.
              </p>
            </div>

            <div className="pt-4 border-t border-indigo-100">
              <p className="text-4xl font-black tracking-tighter text-indigo-600 sm:text-5xl">
                $100
                <span className="text-sm font-semibold text-indigo-400 ml-1 tracking-wide">
                  / Annual
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button className="w-full py-3 px-6 rounded-xl bg-indigo-600 text-white font-semibold transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95">
              Go Platinum
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
