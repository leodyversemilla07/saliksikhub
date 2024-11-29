import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, InfoIcon } from 'lucide-react';

// **Notification Taxonomy**: Structured classification of notification types
const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info',
    ERROR: 'error'
};

// *Semantic Mapping* of notification icons and color schemes
const NOTIFICATION_ICONS = {
    [NOTIFICATION_TYPES.SUCCESS]: CheckCircle,
    [NOTIFICATION_TYPES.WARNING]: AlertTriangle,
    [NOTIFICATION_TYPES.INFO]: InfoIcon,
    [NOTIFICATION_TYPES.ERROR]: AlertTriangle
};

const NOTIFICATION_COLORS = {
    [NOTIFICATION_TYPES.SUCCESS]: 'bg-green-50 border-green-200 text-green-800',
    [NOTIFICATION_TYPES.WARNING]: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    [NOTIFICATION_TYPES.INFO]: 'bg-blue-50 border-blue-200 text-blue-800',
    [NOTIFICATION_TYPES.ERROR]: 'bg-red-50 border-red-200 text-red-800'
};

/**
 * **NotificationCenter**: A dynamic, contextually-aware notification management component
 * Implements cognitive scaffolding principles for information presentation
 */
const NotificationCenter = () => {
    // *State Management*: Reactive notification tracking
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: NOTIFICATION_TYPES.SUCCESS,
            title: 'Manuscript Submission',
            message: 'Your research paper "Urban Resilience Dynamics" has been successfully submitted.',
            timestamp: new Date('2024-03-15T10:30:00'),
            actionable: true
        },
        {
            id: 2,
            type: NOTIFICATION_TYPES.WARNING,
            title: 'Pending Review',
            message: 'Your manuscript requires additional revisions from reviewers.',
            timestamp: new Date('2024-03-14T15:45:00'),
            actionable: true
        },
        {
            id: 3,
            type: NOTIFICATION_TYPES.INFO,
            title: 'System Update',
            message: 'SaliksikHub platform will undergo maintenance on March 20, 2024.',
            timestamp: new Date('2024-03-13T09:15:00'),
            actionable: false
        }
    ]);

    // *Temporal Sorting*: Chronological arrangement of notifications
    const sortedNotifications = [...notifications].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    // **Interaction Handlers**: Modular notification management
    const handleNotificationAction = (notificationId: number) => {
        // Implement notification-specific actions
        console.log(`Actioning notification ${notificationId}`);
    };

    const clearNotification = (notificationId: number) => {
        setNotifications(
            notifications.filter(notification => notification.id !== notificationId)
        );
    };

    return (
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-4">
            {/* **Notification Header**: Cognitive Framing */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <Bell className="text-gray-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                        Notifications
                    </h2>
                </div>
                <span className="text-sm text-gray-500">
                    {notifications.length} New
                </span>
            </div>

            {/* *Notification Stream*: Layered Information Presentation */}
            <div className="space-y-3">
                {sortedNotifications.map(notification => {
                    const NotificationIcon = NOTIFICATION_ICONS[notification.type];
                    const colorScheme = NOTIFICATION_COLORS[notification.type];

                    return (
                        <div
                            key={notification.id}
                            className={`
                flex items-start p-3 rounded-lg border 
                ${colorScheme} 
                transition-all duration-300 ease-in-out
                hover:shadow-sm
              `}
                        >
                            {/* **Semantic Icon Representation** */}
                            <div className="mr-3 mt-1">
                                <NotificationIcon
                                    className={`
                    w-5 h-5 
                    ${colorScheme.includes('green') ? 'text-green-600' :
                                            colorScheme.includes('yellow') ? 'text-yellow-600' :
                                                colorScheme.includes('blue') ? 'text-blue-600' :
                                                    'text-red-600'}
                  `}
                                />
                            </div>

                            {/* *Notification Content Hierarchy* */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-sm">{notification.title}</h3>
                                    <span className="text-xs text-gray-500">
                                        {notification.timestamp.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm">{notification.message}</p>

                                {/* **Action Mechanism**: Contextual Interactivity */}
                                {notification.actionable && (
                                    <div className="mt-2 flex space-x-2">
                                        <button
                                            onClick={() => handleNotificationAction(notification.id)}
                                            className="
                        px-2 py-1 
                        bg-blue-100 text-blue-700 
                        rounded-md text-xs 
                        hover:bg-blue-200 
                        transition-colors
                      "
                                        >
                                            Take Action
                                        </button>
                                        <button
                                            onClick={() => clearNotification(notification.id)}
                                            className="
                        px-2 py-1 
                        bg-gray-100 text-gray-600 
                        rounded-md text-xs 
                        hover:bg-gray-200 
                        transition-colors
                      "
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* **Systemic Overview**: Holistic Notification Management */}
            {notifications.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                    <p>No new notifications</p>
                    <p className="text-xs mt-2">Your research ecosystem is currently calm</p>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;