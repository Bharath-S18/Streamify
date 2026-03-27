const SectionHeader = () => {
  return (
    <div className="mb-4 mt-2">
      {/* Mobile-safe header */}
      <div className="flex items-end justify-between gap-3 sm:hidden">
        <div className="flex items-center gap-2">
          <div className="h-10 w-1 rounded-full bg-red-600" />
          <h3 className="text-2xl font-extrabold tracking-tight text-white">TOP 10</h3>
        </div>
        <p className="text-[10px] font-semibold tracking-[0.22em] text-zinc-300">CONTENT TODAY</p>
      </div>

      {/* Tablet compact header */}
      <div className="hidden sm:flex lg:hidden items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-red-600" />
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">TOP 10</h3>
        </div>
        <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-zinc-300">CONTENT TODAY</p>
      </div>

      {/* Desktop stylized header */}
      <div className="hidden lg:ml-4 lg:mt-4 lg:flex lg:items-center lg:gap-3 lg:mb-6">
        <div className="h-16 w-1 bg-red-600"></div>
        <h3 className="top10-title flex font-bold text-7xl lg:text-8xl">
          <span className="relative z-10 letter-shadow-r">T</span>
          <span className="relative -ml-4 z-20 letter-shadow-r">O</span>
          <span className="relative -ml-4 z-30 letter-shadow-r">P</span>
          <span className="relative ml-2 z-20 letter-shadow-r">1</span>
          <span className="relative -ml-4 z-10 letter-shadow-r">0</span>
        </h3>
        <div className="flex flex-col">
          <h3 className="font-semibold text-sm tracking-[10px] md:text-xl">CONTENT</h3>
          <h3 className="font-semibold text-sm tracking-[10px] md:text-xl">TODAY</h3>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
