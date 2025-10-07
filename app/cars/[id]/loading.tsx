/**
 * Loading component for car detail pages
 * Displays a skeleton UI while the page is loading
 */
export default function CarDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white animate-pulse">
      {/* Navigation Skeleton */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-slate-200 rounded-lg" />
              <div className="h-6 w-48 bg-slate-200 rounded" />
            </div>
            <div className="h-6 w-24 bg-slate-200 rounded" />
          </div>
        </div>
      </nav>

      {/* Breadcrumb Skeleton */}
      <div className="pt-20 pb-4 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="h-4 w-64 bg-slate-200 rounded" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Image Skeleton */}
            <div className="h-[300px] md:h-[400px] lg:h-[500px] bg-slate-200 rounded-2xl" />

            {/* Info Skeleton */}
            <div className="space-y-6">
              <div>
                <div className="h-12 w-3/4 bg-slate-200 rounded mb-4" />
                <div className="h-6 w-full bg-slate-200 rounded" />
              </div>

              <div className="bg-slate-100 rounded-xl p-6">
                <div className="h-12 w-48 bg-slate-200 rounded mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-6 bg-slate-200 rounded" />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-14 bg-slate-200 rounded-lg" />
                <div className="h-14 bg-slate-200 rounded-lg" />
                <div className="flex gap-2">
                  <div className="flex-1 h-12 bg-slate-200 rounded-lg" />
                  <div className="h-12 w-12 bg-slate-200 rounded-lg" />
                  <div className="h-12 w-12 bg-slate-200 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Skeleton */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-32 bg-slate-200 rounded mb-6" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-5/6 bg-slate-200 rounded" />
            <div className="h-4 w-4/6 bg-slate-200 rounded" />
          </div>
        </div>
      </section>

      {/* Specifications Skeleton */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-slate-200 rounded mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
                <div className="h-6 w-32 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}