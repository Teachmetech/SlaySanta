import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, User, ArrowLeft, Plus, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { isValidEmail } from "../lib/utils";

const AuthPage: React.FC = () => {
    const { user, setUser, isLoading: authLoading } = useAuth();
    const [searchParams] = useSearchParams();
    const joinCode = searchParams.get('code');

    const [mode, setMode] = useState<'join' | 'create' | 'user'>(
        joinCode ? 'join' : user ? 'join' : 'user'
    );
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        joinCode: joinCode || "",
        eventName: "",
        eventDescription: "",
        eventDate: "",
        eventBudget: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [createdEventCode, setCreatedEventCode] = useState<string | null>(null);

    const createEvent = useMutation(api.events.create);
    const joinEvent = useMutation(api.participants.joinEvent);

    // Show loading while auth state is being determined
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-festive-red-50 via-white to-festive-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">🎅</div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-festive-red-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    const validateUserForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateEventForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.eventName.trim()) {
            newErrors.eventName = "Event name is required";
        }

        if (!formData.eventDate) {
            newErrors.eventDate = "Event date is required";
        }

        const budget = parseFloat(formData.eventBudget);
        if (formData.eventBudget && (isNaN(budget) || budget < 0)) {
            newErrors.eventBudget = "Budget must be a positive number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateJoinForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.joinCode.trim()) {
            newErrors.joinCode = "Join code is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSetUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateUserForm()) return;

        setUser({
            name: formData.name.trim(),
            email: formData.email.trim(),
        });

        // Switch to join mode to show join/create options
        setMode('join');
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !validateEventForm()) return;

        setIsLoading(true);

        try {
            const result = await createEvent({
                name: formData.eventName.trim(),
                description: formData.eventDescription.trim() || undefined,
                date: formData.eventDate,
                budget: formData.eventBudget ? parseFloat(formData.eventBudget) : undefined,
                organizerName: user.name,
                organizerEmail: user.email,
            });

            setCreatedEventCode(result.joinCode);
        } catch (error: any) {
            setErrors({ submit: error?.message || "Failed to create event" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !validateJoinForm()) return;

        setIsLoading(true);

        try {
            await joinEvent({
                joinCode: formData.joinCode.trim().toUpperCase(),
                name: user.name,
                email: user.email,
            });

            // Redirect to events page after successful join
            window.location.href = `/events?code=${formData.joinCode.trim().toUpperCase()}`;
        } catch (error: any) {
            setErrors({ submit: error?.message || "Failed to join event" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Show event created success
    if (createdEventCode) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-festive-red-50 via-white to-festive-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card>
                            <CardHeader className="text-center">
                                <div className="text-4xl mb-4">🎉</div>
                                <CardTitle className="text-2xl">Event Created!</CardTitle>
                                <CardDescription>
                                    Share this code with your friends so they can join
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="text-center">
                                    <div className="bg-festive-red-50 dark:bg-festive-red-900/20 border-2 border-festive-red-200 dark:border-festive-red-800 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Join Code</p>
                                        <p className="text-3xl font-bold text-festive-red-600 dark:text-festive-red-400 tracking-wider">
                                            {createdEventCode}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `${window.location.origin}?code=${createdEventCode}`
                                            );
                                        }}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Copy Invite Link
                                    </Button>

                                    <Button
                                        onClick={() => window.location.href = `/events?code=${createdEventCode}`}
                                        className="w-full"
                                    >
                                        Manage Event
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-festive-red-50 via-white to-festive-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Back to home link */}
                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Card>
                        <CardHeader className="text-center">
                            <div className="text-4xl mb-4">🎅</div>
                            <CardTitle className="text-2xl">
                                {mode === 'user' ? 'Welcome to SlaySanta!' :
                                    mode === 'create' ? 'Create New Event' : 'Join Event'}
                            </CardTitle>
                            <CardDescription>
                                {mode === 'user' ? 'Enter your details to get started' :
                                    mode === 'create' ? 'Set up a new Secret Santa event' :
                                        'Join an existing Secret Santa event'}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {/* User Info Form */}
                            {mode === 'user' && (
                                <form onSubmit={handleSetUser} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Your Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                        )}
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        Continue
                                    </Button>
                                </form>
                            )}

                            {/* Mode Selection */}
                            {mode !== 'user' && user && (
                                <div className="mb-6">
                                    <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => setMode('join')}
                                            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${mode === 'join'
                                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            Join Event
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMode('create')}
                                            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${mode === 'create'
                                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Event
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Join Event Form */}
                            {mode === 'join' && user && (
                                <form onSubmit={handleJoinEvent} className="space-y-6">
                                    <div>
                                        <label htmlFor="joinCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Join Code
                                        </label>
                                        <input
                                            id="joinCode"
                                            name="joinCode"
                                            type="text"
                                            required
                                            value={formData.joinCode}
                                            onChange={handleInputChange}
                                            className={`input-field uppercase text-center text-lg font-mono tracking-wider ${errors.joinCode ? 'border-red-500' : ''}`}
                                            placeholder="ABC123"
                                            maxLength={6}
                                        />
                                        {errors.joinCode && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.joinCode}</p>
                                        )}
                                    </div>

                                    {errors.submit && (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? 'Joining...' : 'Join Event'}
                                    </Button>
                                </form>
                            )}

                            {/* Create Event Form */}
                            {mode === 'create' && user && (
                                <form onSubmit={handleCreateEvent} className="space-y-6">
                                    <div>
                                        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Event Name
                                        </label>
                                        <input
                                            id="eventName"
                                            name="eventName"
                                            type="text"
                                            required
                                            value={formData.eventName}
                                            onChange={handleInputChange}
                                            className={`input-field ${errors.eventName ? 'border-red-500' : ''}`}
                                            placeholder="Family Christmas 2024"
                                        />
                                        {errors.eventName && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.eventName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Description (optional)
                                        </label>
                                        <textarea
                                            id="eventDescription"
                                            name="eventDescription"
                                            rows={3}
                                            value={formData.eventDescription}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="A fun Secret Santa exchange for the family..."
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Event Date
                                        </label>
                                        <input
                                            id="eventDate"
                                            name="eventDate"
                                            type="date"
                                            required
                                            value={formData.eventDate}
                                            onChange={handleInputChange}
                                            className={`input-field ${errors.eventDate ? 'border-red-500' : ''}`}
                                        />
                                        {errors.eventDate && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.eventDate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="eventBudget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Budget (optional)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                id="eventBudget"
                                                name="eventBudget"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.eventBudget}
                                                onChange={handleInputChange}
                                                className={`input-field pl-8 ${errors.eventBudget ? 'border-red-500' : ''}`}
                                                placeholder="25.00"
                                            />
                                        </div>
                                        {errors.eventBudget && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.eventBudget}</p>
                                        )}
                                    </div>

                                    {errors.submit && (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? 'Creating...' : 'Create Event'}
                                    </Button>
                                </form>
                            )}

                            {/* User info display and change option */}
                            {user && mode !== 'user' && (
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                        Signed in as <strong>{user.name}</strong> ({user.email})
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUser(null);
                                            setMode('user');
                                        }}
                                        className="mt-2 text-sm text-festive-red-600 dark:text-festive-red-400 hover:underline block mx-auto"
                                    >
                                        Change details
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthPage;
