import React, { useState } from 'react';
import { Menu as MenuIcon, X, RefreshCw, Settings as SettingsIcon, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

const Header = ({ onRefresh, loading }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleRefreshClick = () => {
        onRefresh();
        setIsMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
            <div className="container flex h-14 max-w-screen-xl items-center justify-between px-4">
                <Link to="/" className="flex items-center space-x-2">
                    <img src="/logo.svg" alt="NESCO Tracker Logo" className="h-8 w-8" />
                    <span className="text-xl font-bold tracking-tight text-white">
                        NESCO Tracker
                    </span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="p-2 text-slate-400 hover:text-white focus:outline-none"
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute top-14 right-4 w-48 rounded-md border border-slate-700 bg-slate-800 shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                        <Link
                            to="/"
                            className={clsx(
                                "flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white",
                                location.pathname === "/" && "bg-slate-700 text-white"
                            )}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Dashboard
                        </Link>
                        <Link
                            to="/settings"
                            className={clsx(
                                "flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white",
                                location.pathname === "/settings" && "bg-slate-700 text-white"
                            )}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <SettingsIcon className="h-4 w-4 mr-2" />
                            Settings
                        </Link>
                        <button
                            onClick={handleRefreshClick}
                            disabled={loading}
                            className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 text-left"
                        >
                            <RefreshCw className={clsx("h-4 w-4 mr-2", loading && "animate-spin")} />
                            {loading ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
