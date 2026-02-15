import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { clsx } from 'clsx';

const Settings = ({ threshold, setThreshold }) => {
    const [localThreshold, setLocalThreshold] = useState(threshold);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setLocalThreshold(threshold);
    }, [threshold]);

    const handleSave = () => {
        setThreshold(localThreshold);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-medium text-white mb-4">Balance Alerts</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="threshold" className="block text-sm font-medium text-slate-400 mb-2">
                            Low Balance Threshold (BDT)
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="number"
                                id="threshold"
                                value={localThreshold}
                                onChange={(e) => setLocalThreshold(Number(e.target.value))}
                                className="block w-full rounded-md border-0 bg-slate-950 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                            />
                            <span className="text-slate-500">Tk</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                            We'll mark your balance as "Low" when it drops below this amount.
                        </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                        <button
                            onClick={handleSave}
                            className={clsx(
                                "flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all",
                                saved && "bg-emerald-700 ring-2 ring-emerald-500"
                            )}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {saved ? 'Saved!' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
