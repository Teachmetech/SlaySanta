import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Gift,
    Users,
    Shuffle,
    MessageCircle,
    Star,
    ArrowRight
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

const HomePage: React.FC = () => {
    const { user } = useAuth();

    const features = [
        {
            icon: Gift,
            title: "Easy Event Creation",
            description: "Create Secret Santa events in minutes with customizable settings and budgets.",
        },
        {
            icon: Users,
            title: "Simple Participant Management",
            description: "Invite friends via email or share a join code. Track RSVPs effortlessly.",
        },
        {
            icon: Shuffle,
            title: "Fair Automatic Pairing",
            description: "One-click random assignment ensures everyone gets a perfect match.",
        },
        {
            icon: MessageCircle,
            title: "Built-in Chat",
            description: "Coordinate gift ideas and share excitement with event participants.",
        },
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Event Organizer",
            content: "SlaySanta made organizing our office Secret Santa so much easier! No more spreadsheets or manual drawing.",
            rating: 5,
        },
        {
            name: "Mike Chen",
            role: "Family Coordinator",
            content: "Perfect for our large family gatherings. Everyone loves the wishlist feature!",
            rating: 5,
        },
        {
            name: "Emily Rodriguez",
            role: "Friend Group Host",
            content: "The mobile-first design means everyone can participate easily, even my less tech-savvy friends.",
            rating: 5,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-festive-red-50 via-white to-festive-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Navigation for non-logged-in users */}
            {!user && (
                <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <Link
                                to="/"
                                className="flex items-center text-2xl font-bold text-festive-red-600 dark:text-festive-red-400"
                            >
                                🎅 SlaySanta
                            </Link>
                            <div className="flex items-center space-x-4">
                                <Link to="/auth" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                                    Sign In
                                </Link>
                                <Link to="/auth">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            {/* Hero Section */}
            <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                                <span className="block">Make Secret Santa</span>
                                <span className="block text-festive-red-600 dark:text-festive-red-400">
                                    Absolutely Magical
                                </span>
                            </h1>

                            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                                The modern way to organize Secret Santa events. Create, invite, and celebrate
                                with your friends, family, and colleagues.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {user ? (
                                    <Link to="/dashboard">
                                        <Button size="lg" className="w-full sm:w-auto">
                                            Go to Dashboard
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/auth">
                                            <Button size="lg" className="w-full sm:w-auto">
                                                Start Your Event
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <Link to="/auth">
                                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                                Join an Event
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Decorative Elements */}
                        <div className="absolute top-10 left-10 text-4xl animate-bounce-slow">🎁</div>
                        <div className="absolute top-20 right-10 text-3xl animate-pulse-slow">⭐</div>
                        <div className="absolute bottom-10 left-20 text-5xl animate-bounce-slow">🎄</div>
                        <div className="absolute bottom-20 right-20 text-3xl animate-pulse-slow">❄️</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white/50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Everything You Need for Perfect Secret Santa
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            From creation to celebration, we've got every step covered.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="p-8">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-festive-red-100 dark:bg-festive-red-900/20">
                                                    <feature.icon className="h-6 w-6 text-festive-red-600 dark:text-festive-red-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Loved by Secret Santa Organizers
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            See what others are saying about SlaySanta
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="h-full">
                                    <CardContent className="p-6">
                                        <div className="flex items-center mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-4 w-4 text-festive-gold-500 fill-current"
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                            "{testimonial.content}"
                                        </p>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                {testimonial.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {testimonial.role}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-festive-gradient text-white">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Ready to Spread Some Holiday Joy?
                        </h2>
                        <p className="text-xl mb-8 text-white/90">
                            Create your first Secret Santa event in under 2 minutes.
                        </p>

                        {!user && (
                            <Link to="/auth">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="bg-white text-festive-red-600 hover:bg-gray-100"
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-2xl font-bold mb-4">🎅 SlaySanta</div>
                        <p className="text-gray-400 mb-4">
                            Making Secret Santa magical, one event at a time.
                        </p>
                        <div className="text-sm text-gray-500">
                            © 2024 SlaySanta. Built with ❤️ for the holidays.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage; 