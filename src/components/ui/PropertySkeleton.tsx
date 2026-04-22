export default function PropertySkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-pulse">
            {/* Nav Skeleton */}
            <div className="max-w-7xl mx-auto px-6 pt-6">
                <div className="w-32 h-10 bg-slate-200 rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="space-y-4 w-full md:w-2/3">
                        <div className="flex gap-2">
                            <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
                            <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
                        </div>
                        <div className="w-3/4 h-10 bg-slate-200 rounded-lg"></div>
                        <div className="w-1/2 h-6 bg-slate-200 rounded-lg"></div>
                    </div>
                    <div className="space-y-2 w-full md:w-1/3 flex flex-col md:items-end">
                        <div className="w-40 h-12 bg-slate-200 rounded-lg"></div>
                        <div className="w-24 h-4 bg-slate-200 rounded-lg"></div>
                    </div>
                </div>

                {/* Hero Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
                    <div className="bg-slate-200 rounded-2xl h-full w-full"></div>
                    <div className="bg-slate-200 rounded-2xl h-full w-full"></div>
                </div>

                {/* Content Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Bar */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 h-24"></div>

                        {/* Description */}
                        <div className="space-y-4">
                            <div className="w-full h-4 bg-slate-200 rounded"></div>
                            <div className="w-full h-4 bg-slate-200 rounded"></div>
                            <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
                        </div>

                        {/* Analysis Card */}
                        <div className="bg-white rounded-3xl border border-slate-200 h-64"></div>
                    </div>

                    <div className="space-y-6">
                        {/* Sidebar Cards */}
                        <div className="bg-white rounded-2xl border border-slate-200 h-80"></div>
                        <div className="bg-white rounded-2xl border border-slate-200 h-60"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
