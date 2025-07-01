import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Sun, Moon, Monitor, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

const SettingsPage: React.FC = () => {
    const { user, setUser } = useAuth();
    const { theme, setTheme } = useTheme();

    if (!user) {
        return null; // This should be handled by the layout
    }

    const themeOptions = [
        { value: "light", label: "Light", icon: Sun },
        { value: "dark", label: "Dark", icon: Moon },
        { value: "system", label: "System", icon: Monitor },
    ] as const;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Settings ⚙️
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your session and preferences
                    </p>
                </motion.div>

                {/* Current Session */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>👤 Current Session</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="w-10 h-10 bg-festive-red-100 dark:bg-festive-red-900/20 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-festive-red-600 dark:text-festive-red-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Display name
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {user.email}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Email address
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                Session Storage
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Your session is stored locally in your browser
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => setUser(null)}
                                            variant="outline"
                                            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Sign Out
                                        </Button>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            💡 Your session will be remembered until you sign out or close your browser.
                                            No personal data is stored on our servers.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Theme Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>🎨 Appearance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                                        Theme Preference
                                    </h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {themeOptions.map((option) => {
                                            const Icon = option.icon;
                                            const isSelected = theme === option.value;

                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setTheme(option.value)}
                                                    className={`p-4 rounded-lg border-2 transition-all ${isSelected
                                                            ? "border-festive-red-500 bg-festive-red-50 dark:bg-festive-red-900/20"
                                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                                        }`}
                                                >
                                                    <div className="text-center">
                                                        <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${isSelected
                                                                ? "bg-festive-red-500 text-white"
                                                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                                            }`}>
                                                            <Icon className="w-4 h-4" />
                                                        </div>
                                                        <p className={`text-sm font-medium ${isSelected
                                                                ? "text-festive-red-700 dark:text-festive-red-300"
                                                                : "text-gray-700 dark:text-gray-300"
                                                            }`}>
                                                            {option.label}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                                        {theme === "system"
                                            ? "Automatically matches your system preference"
                                            : `Always use ${theme} mode`
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* App Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-8"
                >
                    <Card className="bg-gray-50 dark:bg-gray-800/50">
                        <CardHeader>
                            <CardTitle>🎅 About SlaySanta</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <p>
                                    <strong>SlaySanta</strong> is a simple, ephemeral Secret Santa organizer.
                                    Perfect for yearly gift exchanges with friends, family, or colleagues.
                                </p>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">✨ Features</p>
                                        <ul className="mt-1 space-y-1 text-xs">
                                            <li>• No account required</li>
                                            <li>• Simple join codes</li>
                                            <li>• Fair assignment algorithm</li>
                                            <li>• Wishlist management</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">🔒 Privacy</p>
                                        <ul className="mt-1 space-y-1 text-xs">
                                            <li>• Session-based storage</li>
                                            <li>• No permanent accounts</li>
                                            <li>• Data not persisted</li>
                                            <li>• Open source</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-center">
                                        Made with ❤️ for the holiday spirit
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default SettingsPage; 