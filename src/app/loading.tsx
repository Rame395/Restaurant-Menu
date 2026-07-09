export default function Loading() {
  return (
    <div className="min-h-screen bg-[#201409] text-neutral-200 font-sans">
      {/* Skeleton Top Nav */}
      <div className="px-4 py-4 sticky top-0 z-50 bg-[#201409]/90 backdrop-blur-xl border-b border-neutral-800/80 flex flex-col items-center">
        <div className="w-24 h-12 bg-neutral-800 rounded-full animate-pulse mb-4"></div>
        <div className="w-full max-w-lg h-12 bg-neutral-800 rounded-2xl animate-pulse"></div>
      </div>

      <div className="max-w-3xl mx-auto pb-12">
        {/* Skeleton Hero */}
        <div className="w-full py-16 mb-4 flex flex-col items-center justify-center">
          <div className="w-64 sm:w-96 h-12 bg-neutral-800/50 rounded-lg animate-pulse mb-4"></div>
          <div className="w-48 sm:w-64 h-6 bg-neutral-800/50 rounded-lg animate-pulse"></div>
        </div>

        {/* Skeleton Grid */}
        <div className="px-4 grid grid-cols-2 gap-x-5 gap-y-8 mt-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-800 animate-pulse border border-neutral-700/40">
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-800 via-neutral-700 to-neutral-800 skeleton-shimmer"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Shimmer animation style inline for ease */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          transform: translateX(-100%);
          animation: shimmer 2s infinite;
        }
      `}} />
    </div>
  );
}
