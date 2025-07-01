import React, { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Calendar, DollarSign, Plus, ArrowLeft, Gift, Crown, Eye, Mail, Send } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import { formatDate } from "../lib/utils";

const EventsPage: React.FC = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const eventCode = searchParams.get('code');

    const [showWishlistModal, setShowWishlistModal] = useState(false);
    const [wishlistText, setWishlistText] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmails, setInviteEmails] = useState("");

    // Get all events for the user (when no code is provided)
    const myEvents = useQuery(
        api.events.getMyEvents,
        !eventCode && user ? { email: user.email } : "skip"
    );

    // Get event by join code if provided
    const event = useQuery(
        api.events.getByJoinCode,
        eventCode ? { joinCode: eventCode } : "skip"
    );

    // Get event details including participants
    const eventDetails = useQuery(
        api.events.getEventDetails,
        event && event._id ? { eventId: event._id } : "skip"
    );

    // Get current user's participant info
    const currentParticipant = useQuery(
        api.participants.getParticipantByEmail,
        event && user ? { eventId: event._id, email: user.email } : "skip"
    );

    // Get assignment if drawn
    const assignment = useQuery(
        api.assignments.getMyAssignment,
        event && user ? { eventId: event._id, email: user.email } : "skip"
    );

    const updateWishlist = useMutation(api.participants.updateWishlist);
    const drawAssignments = useMutation(api.assignments.drawAssignments);
    const sendBulkInvitations = useMutation(api.emails.sendBulkInvitations);

    if (!user) {
        return null; // This should be handled by the layout
    }

    // Show specific event details if event code is provided
    if (eventCode) {
        if (event === undefined || eventDetails === undefined) {
            return (
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-festive-red-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading event...</p>
                    </div>
                </div>
            );
        }

        if (!event || !eventDetails) {
            return (
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                Event Not Found 😞
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                The join code <strong>{eventCode}</strong> doesn't match any event. Please check the code and try again.
                            </p>
                            <Button onClick={() => navigate('/events')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to My Events
                            </Button>
                        </motion.div>
                    </div>
                </div>
            );
        }

        return <SpecificEventView
            event={event}
            eventDetails={eventDetails}
            currentParticipant={currentParticipant}
            assignment={assignment}
            user={user}
            showWishlistModal={showWishlistModal}
            setShowWishlistModal={setShowWishlistModal}
            wishlistText={wishlistText}
            setWishlistText={setWishlistText}
            updateWishlist={updateWishlist}
            drawAssignments={drawAssignments}
            showInviteModal={showInviteModal}
            setShowInviteModal={setShowInviteModal}
            inviteEmails={inviteEmails}
            setInviteEmails={setInviteEmails}
            sendBulkInvitations={sendBulkInvitations}
        />;
    }

    // Show all events when no specific code is provided
    if (myEvents === undefined) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-festive-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your events...</p>
                </div>
            </div>
        );
    }

    return <AllEventsView events={myEvents} user={user} />;
};

// Component for showing all events
const AllEventsView: React.FC<{
    events: any[];
    user: any;
}> = ({ events }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            My Events 🎄
                        </h1>
                        <Link to="/auth">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Event
                            </Button>
                        </Link>
                    </div>

                    {events.length === 0 ? (
                        <div className="text-center py-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                    No Events Yet 🎅
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-8">
                                    You haven't joined any Secret Santa events yet. Create your first event or join one with a code!
                                </p>
                                <div className="space-y-4">
                                    <Link to="/auth">
                                        <Button className="w-full sm:w-auto mr-4">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create New Event
                                        </Button>
                                    </Link>
                                    <Link to="/auth">
                                        <Button variant="outline" className="w-full sm:w-auto">
                                            <Users className="w-4 h-4 mr-2" />
                                            Join Event with Code
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.map((event, index) => (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-lg line-clamp-2">
                                                    {event.name}
                                                    {event.isOrganizer && (
                                                        <Crown className="w-4 h-4 inline ml-2 text-yellow-500" />
                                                    )}
                                                </CardTitle>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Code</div>
                                                    <div className="text-sm font-mono font-bold text-festive-red-600 dark:text-festive-red-400">
                                                        {event.joinCode}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {event.description && (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                                    {event.description}
                                                </p>
                                            )}

                                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    {formatDate(event.date)}
                                                </div>
                                                {event.budget && (
                                                    <div className="flex items-center">
                                                        <DollarSign className="w-4 h-4 mr-2" />
                                                        ${event.budget} budget
                                                    </div>
                                                )}
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-2" />
                                                    {event.participantCount} participant{event.participantCount !== 1 ? 's' : ''}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className={`px-2 py-1 rounded text-xs font-medium ${event.isDrawn
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                    }`}>
                                                    {event.isDrawn ? '🎯 Drawn' : '⏳ Pending'}
                                                </div>
                                                <Link to={`/events?code=${event.joinCode}`}>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

// Component for showing specific event details
const SpecificEventView: React.FC<{
    event: any;
    eventDetails: any;
    currentParticipant: any;
    assignment: any;
    user: any;
    showWishlistModal: boolean;
    setShowWishlistModal: (show: boolean) => void;
    wishlistText: string;
    setWishlistText: (text: string) => void;
    updateWishlist: any;
    drawAssignments: any;
    showInviteModal: boolean;
    setShowInviteModal: (show: boolean) => void;
    inviteEmails: string;
    setInviteEmails: (emails: string) => void;
    sendBulkInvitations: any;
}> = ({
    event,
    eventDetails,
    currentParticipant,
    assignment,
    user,
    showWishlistModal,
    setShowWishlistModal,
    wishlistText,
    setWishlistText,
    updateWishlist,
    drawAssignments,
    showInviteModal,
    setShowInviteModal,
    inviteEmails,
    setInviteEmails,
    sendBulkInvitations
}) => {
        const isOrganizer = user.email === event.organizerEmail;

        const handleUpdateWishlist = async () => {
            if (!event || !user) return;

            try {
                await updateWishlist({
                    eventId: event._id,
                    email: user.email,
                    wishlist: wishlistText,
                });
                setShowWishlistModal(false);
            } catch (error) {
                console.error("Failed to update wishlist:", error);
            }
        };

        const handleDrawAssignments = async () => {
            if (!event || !user || !isOrganizer) return;

            try {
                await drawAssignments({
                    eventId: event._id,
                    organizerEmail: user.email,
                });
            } catch (error) {
                console.error("Failed to draw assignments:", error);
            }
        };

        const handleSendInvitations = async () => {
            if (!event || !user || !isOrganizer) return;

            try {
                const emailList = inviteEmails
                    .split('\n')
                    .map(email => email.trim())
                    .filter(email => email.length > 0);

                if (emailList.length === 0) {
                    alert("Please enter at least one email address");
                    return;
                }

                const result = await sendBulkInvitations({
                    eventId: event._id,
                    organizerEmail: user.email,
                    inviteEmails: emailList,
                });

                if (result.sent > 0) {
                    alert(`Successfully sent ${result.sent} invitation(s)!`);
                    setInviteEmails("");
                    setShowInviteModal(false);
                }

                if (result.failed.length > 0) {
                    alert(`Failed to send to: ${result.failed.join(', ')}`);
                }
            } catch (error: any) {
                console.error("Failed to send invitations:", error);
                alert(error?.message || "Failed to send invitations");
            }
        };

        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Navigation */}
                    <Link to="/events" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to My Events
                    </Link>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {eventDetails.event.name}
                                {isOrganizer && (
                                    <Crown className="w-6 h-6 inline ml-3 text-yellow-500" />
                                )}
                            </h1>
                            <div className="flex items-center gap-4">
                                {isOrganizer && (
                                    <Button
                                        onClick={() => setShowInviteModal(true)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Invites
                                    </Button>
                                )}
                                <div className="text-right">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Join Code</div>
                                    <div className="text-lg font-mono font-bold text-festive-red-600 dark:text-festive-red-400">
                                        {event.joinCode}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {eventDetails.event.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {eventDetails.event.description}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(eventDetails.event.date)}
                            </div>
                            {eventDetails.event.budget && (
                                <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    ${eventDetails.event.budget} budget
                                </div>
                            )}
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                {eventDetails.participantCount} participants
                            </div>
                        </div>
                    </motion.div>

                    {/* Status Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Assignment Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Card className={`${event.isDrawn ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'}`}>
                                <CardHeader>
                                    <CardTitle className={`${event.isDrawn ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                                        {event.isDrawn ? '🎯 Assignments Drawn!' : '⏳ Waiting for Draw'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {event.isDrawn ? (
                                        assignment ? (
                                            <div>
                                                <p className="mb-2">Your Secret Santa assignment:</p>
                                                <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                                                    <p className="font-semibold">{assignment.receiverName}</p>
                                                    {assignment.receiverWishlist && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            Wishlist: {assignment.receiverWishlist}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <p>Assignments have been drawn! Check with the organizer.</p>
                                        )
                                    ) : (
                                        <div>
                                            <p className="mb-4">Waiting for the organizer to draw Secret Santa assignments.</p>
                                            {isOrganizer && eventDetails.participantCount >= 3 && (
                                                <Button onClick={handleDrawAssignments}>
                                                    <Gift className="w-4 h-4 mr-2" />
                                                    Draw Assignments
                                                </Button>
                                            )}
                                            {isOrganizer && eventDetails.participantCount < 3 && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Need at least 3 participants to draw assignments.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Wishlist Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>🎁 Your Wishlist</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {currentParticipant?.wishlist ? (
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current wishlist:</p>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded mb-3">
                                                <p>{currentParticipant.wishlist}</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setWishlistText(currentParticipant.wishlist || "");
                                                    setShowWishlistModal(true);
                                                }}
                                            >
                                                Update Wishlist
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                Add items to help your Secret Santa choose the perfect gift!
                                            </p>
                                            <Button
                                                onClick={() => {
                                                    setWishlistText("");
                                                    setShowWishlistModal(true);
                                                }}
                                            >
                                                Add Wishlist
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Participants List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>👥 Participants ({eventDetails.participantCount})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {eventDetails.participants.map((participant: any) => (
                                        <div
                                            key={participant._id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {participant.name}
                                                    {participant.isOrganizer && (
                                                        <Crown className="w-4 h-4 inline ml-2 text-yellow-500" />
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {participant.email}
                                                </p>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-medium ${participant.status === 'accepted'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                : participant.status === 'declined'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                }`}>
                                                {participant.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Wishlist Modal */}
                    {showWishlistModal && (
                        <Modal
                            isOpen={showWishlistModal}
                            onClose={() => setShowWishlistModal(false)}
                            title="Update Your Wishlist"
                        >
                            <div className="space-y-4">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Help your Secret Santa by adding gift ideas, preferences, or anything that would make you happy!
                                </p>
                                <textarea
                                    value={wishlistText}
                                    onChange={(e) => setWishlistText(e.target.value)}
                                    placeholder="Enter your wishlist items, gift ideas, favorite stores, sizes, colors, or anything else that might help your Secret Santa..."
                                    className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-festive-red-500 focus:border-transparent resize-none"
                                />
                                <div className="flex justify-end space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowWishlistModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleUpdateWishlist}>
                                        Save Wishlist
                                    </Button>
                                </div>
                            </div>
                        </Modal>
                    )}

                    {/* Email Invitation Modal */}
                    {showInviteModal && (
                        <Modal
                            isOpen={showInviteModal}
                            onClose={() => setShowInviteModal(false)}
                            title="Send Email Invitations"
                            size="lg"
                        >
                            <div className="space-y-4">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Send email invitations to people you'd like to join your Secret Santa event. Enter one email address per line.
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Addresses
                                    </label>
                                    <textarea
                                        value={inviteEmails}
                                        onChange={(e) => setInviteEmails(e.target.value)}
                                        placeholder="friend1@example.com&#10;friend2@example.com&#10;family@example.com"
                                        className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-festive-red-500 focus:border-transparent resize-none"
                                    />
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Enter one email address per line. Each person will receive a beautiful invitation email with the join code and event details.
                                    </p>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowInviteModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSendInvitations}
                                        disabled={!inviteEmails.trim()}
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Invitations
                                    </Button>
                                </div>
                            </div>
                        </Modal>
                    )}
                </div>
            </div>
        );
    };

export default EventsPage; 