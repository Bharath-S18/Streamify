const SectionHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-6 ml-4 mt-4">
      <h3 className="top10-title font-bold text-6xl sm:text-7xl lg:text-8xl flex">
        <span className="relative z-10 letter-shadow-r">T</span>
        <span className="relative -ml-4 z-20 letter-shadow-r">O</span>
        <span className="relative -ml-4 z-30 letter-shadow-r">P</span>
        <span className="relative ml-2 z-20 letter-shadow-r">1</span>
        <span className="relative -ml-4 z-10 letter-shadow-r">0</span>
      </h3>
      <div className="flex flex-col">
        <h3 className="font-semibold text-sm tracking-[10px] md:text-xl">
          CONTENT
        </h3>
        <h3 className="font-semibold text-sm tracking-[10px] md:text-xl">
          TODAY
        </h3>
      </div>
    </div>
  );
};

export default SectionHeader;
