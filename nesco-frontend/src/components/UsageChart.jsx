import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const UsageChart = ({ data }) => {
    // Process data for chart - reverse to show chronological order left-to-right
    const chartData = [...data].reverse().map(item => ({
        date: new Date(item.scrapedAt).getTime(),
        fullDate: item.scrapedAt,
        balance: item.balance
    }));

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-medium leading-6 text-white">
                    Balance History
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                    Your electricity balance trend over the last 30 scraped records.
                </p>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                        <XAxis
                            dataKey="date"
                            type="number"
                            domain={['auto', 'auto']}
                            tickFormatter={(unixTime) => format(new Date(unixTime), 'dd MMM')}
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `৳${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                borderColor: '#1e293b',
                                borderRadius: '8px',
                                color: '#f8fafc',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)'
                            }}
                            labelFormatter={(label) => format(new Date(label), 'PPpp')}
                            formatter={(value) => [`৳ ${value}`, 'Balance']}
                        />
                        <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: '#10b981', strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UsageChart;
