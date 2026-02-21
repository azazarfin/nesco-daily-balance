import React from 'react';
import HeroCard from './HeroCard';
import UsageChart from './UsageChart';
import HistoryList from './HistoryList';

const Dashboard = ({ data, loading, error, onRetry, threshold }) => {
    // Derived state
    const currentBalance = data.length > 0 ? data[0].balance : null;
    const lastUpdated = data.length > 0 ? data[0].scrapedAt : null;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <h2 className="text-2xl font-bold text-white">Connection Error</h2>
                <p className="mt-2 text-slate-400">{error}</p>
                <button
                    onClick={onRetry}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: Hero Status */}
                <div className="md:col-span-1 min-w-0">
                    <HeroCard
                        currentBalance={currentBalance}
                        lastUpdated={lastUpdated}
                        threshold={threshold}
                    />
                </div>

                {/* Right Column: Chart */}
                <div className="md:col-span-2 min-w-0">
                    {loading && data.length === 0 ? (
                        <div className="h-[300px] w-full animate-pulse rounded-xl bg-slate-800"></div>
                    ) : (
                        <UsageChart data={data} />
                    )}
                </div>

                {/* Bottom Row: History Table */}
                <div className="md:col-span-3 min-w-0">
                    <HistoryList data={data} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
