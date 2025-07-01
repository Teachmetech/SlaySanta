import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Users, Calendar, Gift } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return null; // This should be handled by the layout
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Welcome back, {user.name}! 🎅
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Ready to spread some holiday magic?
                    </p>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid md:grid-cols-2 gap-6 mb-8"
                >
                    <Card className="bg-gradient-to-br from-festive-red-50 to-festive-red-100 dark:from-festive-red-900/20 dark:to-festive-red-800/20 border-festive-red-200 dark:border-festive-red-800">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-festive-red-500 rounded-lg">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-festive-red-700 dark:text-festive-red-300">
                                    Create New Event
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Start a new Secret Santa event and invite your friends, family, or colleagues.
                            </p>
                            <Link to="/auth">
                                <Button className="w-full">
                                    Create Event
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-festive-green-50 to-festive-green-100 dark:from-festive-green-900/20 dark:to-festive-green-800/20 border-festive-green-200 dark:border-festive-green-800">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-festive-green-500 rounded-lg">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-festive-green-700 dark:text-festive-green-300">
                                    Join an Event
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Have a join code? Join an existing Secret Santa event and start the fun!
                            </p>
                            <Link to="/auth">
                                <Button variant="outline" className="w-full border-festive-green-500 text-festive-green-600 hover:bg-festive-green-50 dark:border-festive-green-400 dark:text-festive-green-400 dark:hover:bg-festive-green-900/20">
                                    Join Event
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* How it Works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">How SlaySanta Works</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-festive-red-100 to-festive-red-200 dark:from-festive-red-900/40 dark:to-festive-red-800/40 rounded-full flex items-center justify-center">
                                        <Plus className="w-8 h-8 text-festive-red-600 dark:text-festive-red-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">1. Create or Join</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Create a new event or join an existing one with a 6-character code.
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-festive-green-100 to-festive-green-200 dark:from-festive-green-900/40 dark:to-festive-green-800/40 rounded-full flex items-center justify-center">
                                        <Users className="w-8 h-8 text-festive-green-600 dark:text-festive-green-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">2. Invite Friends</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Share the join code with friends and family. Everyone adds their wishlist.
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 rounded-full flex items-center justify-center">
                                        <Gift className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">3. Draw & Give</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        The organizer draws names, everyone gets their Secret Santa assignment!
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-8"
                >
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-6 h-6 text-festive-red-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Event Management</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            Set dates, budgets, and descriptions for your Secret Santa events.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Gift className="w-6 h-6 text-festive-green-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Wishlist Management</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            Everyone can add their wishlist to help their Secret Santa choose the perfect gift.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Users className="w-6 h-6 text-blue-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Easy Sharing</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            Simple 6-character codes make it easy to invite anyone to your event.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 text-purple-500 mt-1 text-center">🎲</div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Fair Assignment</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            Our algorithm ensures everyone gets someone and no one gets themselves.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Current User Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-8 text-center"
                >
                    <Card className="bg-gray-50 dark:bg-gray-800/50">
                        <CardContent className="py-6">
                            <p className="text-gray-600 dark:text-gray-400">
                                You're signed in as <strong>{user.name}</strong> ({user.email})
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                This session will be remembered until you sign out or close your browser.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardPage; 