import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Home,
    Calendar,
    Settings,
    Sun,
    Moon,
    Monitor,
    Menu,
    X,
    LogOut
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import Button from "./ui/Button";
import { cn } from "../lib/utils";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, setUser } = useAuth();
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Events", href: "/events", icon: Calendar },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    const themeIcons = {
        light: Sun,
        dark: Moon,
        system: Monitor,
    };

    const ThemeIcon = themeIcons[theme];

    const cycleTheme = () => {
        const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navigation */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo and Desktop Navigation */}
                        <div className="flex">
                            <Link
                                to="/"
                                className="flex items-center px-4 text-xl font-bold text-festive-red-600 dark:text-festive-red-400"
                            >
                                🎅 SlaySanta
                            </Link>

                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname.startsWith(item.href);

                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={cn(
                                                "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                                                isActive
                                                    ? "border-festive-red-500 text-gray-900 dark:text-gray-100"
                                                    : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300"
                                            )}
                                        >
                                            <Icon className="w-4 h-4 mr-2" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={cycleTheme}
                                className="p-2"
                                aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
                            >
                                <ThemeIcon className="h-4 w-4" />
                            </Button>

                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                {user.name}
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setUser(null)}
                                className="p-2"
                                aria-label="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="sm:hidden flex items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2"
                                aria-label="Toggle mobile menu"
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="sm:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
                    >
                        <div className="pt-2 pb-3 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                                            isActive
                                                ? "bg-festive-red-50 dark:bg-festive-red-900/20 border-festive-red-500 text-festive-red-700 dark:text-festive-red-400"
                                                : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200"
                                        )}
                                    >
                                        <div className="flex items-center">
                                            <Icon className="w-4 h-4 mr-3" />
                                            {item.name}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center px-4">
                                <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                    {user.name}
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <button
                                    onClick={cycleTheme}
                                    className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                >
                                    <div className="flex items-center">
                                        <ThemeIcon className="w-4 h-4 mr-3" />
                                        Theme: {theme}
                                    </div>
                                </button>
                                <button
                                    onClick={() => setUser(null)}
                                    className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                >
                                    <div className="flex items-center">
                                        <LogOut className="w-4 h-4 mr-3" />
                                        Logout
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </nav>

            {/* Main Content */}
            <main className="min-h-[calc(100vh-4rem)]">
                {children}
            </main>
        </div>
    );
};

export default Layout; 