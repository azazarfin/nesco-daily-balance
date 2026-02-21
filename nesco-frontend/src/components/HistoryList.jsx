import React from 'react';
import { format } from 'date-fns';

const HistoryList = ({ data }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
            <div className="px-6 py-5 border-b border-slate-800">
                <h3 className="text-lg font-medium leading-6 text-white">
                    Recent Records
                </h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-slate-800">
                    <thead className="bg-slate-950 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Date Scraped
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Portal Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Balance
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-900 divide-y divide-slate-800">
                        {data.map((record) => (
                            <tr key={record._id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                    {format(new Date(record.scrapedAt), 'PP p')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                    {record.rawTimeText}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium text-right">
                                    ৳ {record.balance.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No records found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryList;
