export function HomepageSkeleton() {
  return (
    <div className="min-h-[100svh] gradient-hero animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="h-7 w-56 rounded-full bg-white/10 mb-6" />
        <div className="h-16 sm:h-20 md:h-24 w-full max-w-3xl bg-white/10 rounded-2xl mb-4" />
        <div className="h-16 sm:h-20 md:h-24 w-2/3 max-w-2xl bg-white/10 rounded-2xl mb-8" />
        <div className="h-6 w-full max-w-2xl bg-white/5 rounded mb-2" />
        <div className="h-6 w-3/4 max-w-xl bg-white/5 rounded mb-10" />
        <div className="flex gap-3">
          <div className="h-12 w-32 rounded-full bg-white/10" />
          <div className="h-12 w-36 rounded-full bg-white/5" />
          <div className="h-12 w-40 rounded-full bg-white/5" />
        </div>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
