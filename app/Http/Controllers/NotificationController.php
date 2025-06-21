<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display all notifications for the authenticated user
     */
    public function index()
    {
        $user = Auth::user();
        $notifications = $user->notifications()->paginate(15);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Get notifications for dropdown (API endpoint)
     */
    public function getNotifications()
    {
        $user = Auth::user();
        $notifications = $user->notifications()
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $this->getNotificationType($notification->data),
                    'title' => $this->getNotificationTitle($notification->data),
                    'message' => $this->getNotificationMessage($notification->data),
                    'time' => $notification->created_at->diffForHumans(),
                    'read' => ! is_null($notification->read_at),
                    'actionUrl' => $this->getActionUrl($notification->data),
                    'actionLabel' => $this->getActionLabel($notification->data),
                ];
            });

        $unreadCount = $user->unreadNotifications()->count();

        return response()->json([
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead($id)
    {
        $user = Auth::user();
        $notification = $user->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();

            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false], 404);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        $user->unreadNotifications->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Get notification type based on notification data
     */
    private function getNotificationType($data)
    {
        // First check explicit type field
        if (isset($data['type'])) {
            switch ($data['type']) {
                case 'status_change':
                    return 'status';
                case 'revision_submitted':
                    return 'revision';
                default:
                    // Continue to other checks
                    break;
            }
        }

        // Check for status changes based on previous_status and new_status
        if (isset($data['previous_status']) && isset($data['new_status'])) {
            return 'status';
        }

        if (isset($data['decision_type'])) {
            switch ($data['decision_type']) {
                case 'Accept':
                    return 'acceptance';
                case 'Minor Revision':
                case 'Major Revision':
                    return 'revision';
                case 'Reject':
                    return 'review';
                default:
                    return 'system';
            }
        }

        if (isset($data['manuscript_id'])) {
            return 'submission';
        }

        return 'system';
    }

    /**
     * Get notification title based on notification data
     */
    private function getNotificationTitle($data)
    {
        // Check for status change notifications first
        if (isset($data['type']) && $data['type'] === 'status_change') {
            return 'Manuscript Status Changed';
        }

        // Check if we have previous and new status
        if (isset($data['previous_status']) && isset($data['new_status'])) {
            return 'Status Changed: '.$data['new_status'];
        }

        if (isset($data['decision_type'])) {
            switch ($data['decision_type']) {
                case 'Accept':
                    return 'Manuscript Accepted';
                case 'Minor Revision':
                    return 'Minor Revision Required';
                case 'Major Revision':
                    return 'Major Revision Required';
                case 'Reject':
                    return 'Manuscript Rejected';
                default:
                    return 'Manuscript Update';
            }
        }

        // Add specific handling for revision submission notifications
        if (isset($data['type']) && $data['type'] === 'revision_submitted') {
            return 'Revised Manuscript Submitted';
        }

        if (isset($data['manuscript_title'])) {
            return 'Submission Update: '.substr($data['manuscript_title'], 0, 30).'...';
        }

        return 'System Notification';
    }

    /**
     * Get notification message based on notification data
     */
    private function getNotificationMessage($data)
    {
        // Check for status change notifications
        if (
            isset($data['type']) && $data['type'] === 'status_change' &&
            isset($data['previous_status']) && isset($data['new_status'])
        ) {
            return 'Your manuscript "'.$data['manuscript_title'].'" status has changed from '.
                $data['previous_status'].' to '.$data['new_status'].'.';
        }

        if (isset($data['decision_type']) && isset($data['manuscript_title'])) {
            $title = $data['manuscript_title'];
            switch ($data['decision_type']) {
                case 'Accept':
                    return "Congratulations! Your manuscript \"$title\" has been accepted for publication.";
                case 'Minor Revision':
                    return "Your manuscript \"$title\" requires minor revisions before it can be accepted.";
                case 'Major Revision':
                    return "Your manuscript \"$title\" requires major revisions before it can be considered for publication.";
                case 'Reject':
                    return "Your manuscript \"$title\" has not been accepted for publication.";
                default:
                    return "There's an update on your manuscript \"$title\".";
            }
        }

        return $data['message'] ?? 'You have a new notification.';
    }

    /**
     * Get action URL for the notification
     */
    private function getActionUrl($data)
    {
        if (isset($data['manuscript_id'])) {
            $user = Auth::user();

            // Generate the appropriate URL based on user role
            if ($user->role === 'editor') {
                return '/editor/manuscripts/'.$data['manuscript_id'];
            } else {
                // Use manuscript.show route for authors
                return '/author/manuscripts/'.$data['manuscript_id'];
            }
        }

        return null;
    }

    /**
     * Get action label for the notification
     */
    private function getActionLabel($data)
    {
        // For status change notifications
        if (isset($data['type']) && $data['type'] === 'status_change') {
            return 'View Manuscript';
        }

        if (isset($data['decision_type'])) {
            switch ($data['decision_type']) {
                case 'Accept':
                    return 'View Details';
                case 'Minor Revision':
                case 'Major Revision':
                    return 'Start Revision';
                case 'Reject':
                    return 'View Review';
                default:
                    return 'View Manuscript';
            }
        }

        return 'View Details';
    }
}
