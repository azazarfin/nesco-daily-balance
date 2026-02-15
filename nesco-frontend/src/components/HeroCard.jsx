import React from 'react';
import { Wallet, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

const HeroCard = ({ currentBalance, lastUpdated, threshold = 200 }) => {
    const isLowBalance = currentBalance !== null && currentBalance < threshold;

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4">
                <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    Current Balance
                </h2>
                <div className={clsx(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    isLowBalance ? "bg-rose-900/30 text-rose-400" : "bg-emerald-900/30 text-emerald-400"
                )}>
                    {isLowBalance ? "Low Balance" : "Healthy"}
                </div>
            </div>

            <div className="flex items-baseline space-x-2">
                <span className={clsx(
                    "text-4xl font-extrabold tracking-tight",
                    isLowBalance ? "text-rose-500" : "text-emerald-500"
                )}>
                    {currentBalance !== null ? `৳ ${currentBalance.toFixed(2)}` : '---'}
                </span>
                <span className="text-slate-500 font-medium">BDT</span>
            </div>

            <div className="mt-4 border-t border-slate-800 pt-4">
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <Wallet className="h-3.5 w-3.5" />
                    <span>
                        Last updated: {lastUpdated ? formatDistanceToNow(new Date(lastUpdated), { addSuffix: true }) : 'Never'}
                    </span>
                </div>
            </div>

            {isLowBalance && (
                <div className="mt-4 rounded-md bg-rose-950/30 border border-rose-900/50 p-3">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-rose-500" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-rose-400">Attention needed</h3>
                            <div className="mt-1 text-sm text-rose-300/80">
                                <p>Your balance is below {threshold} Tk. Please recharge soon.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroCard;
