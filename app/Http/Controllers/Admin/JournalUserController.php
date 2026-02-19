<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignJournalUserRequest;
use App\Http\Requests\Admin\UpdateJournalUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class JournalUserController extends Controller
{
    /**
     * The available journal-level roles.
     */
    public const JOURNAL_ROLES = [
        'managing_editor' => 'Managing Editor',
        'editor_in_chief' => 'Editor in Chief',
        'associate_editor' => 'Associate Editor',
        'language_editor' => 'Language Editor',
        'reviewer' => 'Reviewer',
        'author' => 'Author',
    ];

    /**
     * Display a listing of users assigned to the current journal.
     */
    public function index(Request $request): Response
    {
        $journal = app('currentJournal');

        $search = $request->input('search');
        $roleFilter = $request->input('role');
        $statusFilter = $request->input('status');

        $query = $journal->users()
            ->select('users.id', 'users.firstname', 'users.lastname', 'users.email', 'users.role', 'users.affiliation', 'users.avatar', 'users.created_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('users.firstname', 'like', "%{$search}%")
                    ->orWhere('users.lastname', 'like', "%{$search}%")
                    ->orWhere('users.email', 'like', "%{$search}%")
                    ->orWhere('users.affiliation', 'like', "%{$search}%");
            });
        }

        if ($roleFilter && $roleFilter !== 'all') {
            $query->wherePivot('role', $roleFilter);
        }

        if ($statusFilter && $statusFilter !== 'all') {
            $query->wherePivot('is_active', $statusFilter === 'active');
        }

        $users = $query->orderBy('users.lastname')
            ->orderBy('users.firstname')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/journal-users/index', [
            'journalUsers' => $users,
            'roles' => self::JOURNAL_ROLES,
            'filters' => [
                'search' => $search,
                'role' => $roleFilter,
                'status' => $statusFilter,
            ],
        ]);
    }

    /**
     * Show the form for assigning a user to the journal.
     */
    public function create(Request $request): Response
    {
        $journal = app('currentJournal');
        $search = $request->input('search');

        // Get users NOT already assigned to this journal (or with different roles)
        $availableUsersQuery = User::query()
            ->select('id', 'firstname', 'lastname', 'email', 'role', 'affiliation')
            ->whereDoesntHave('journals', function ($q) use ($journal) {
                $q->where('journals.id', $journal->id);
            })
            ->orderBy('lastname')
            ->orderBy('firstname');

        if ($search) {
            $availableUsersQuery->where(function ($q) use ($search) {
                $q->where('firstname', 'like', "%{$search}%")
                    ->orWhere('lastname', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $availableUsers = $availableUsersQuery->paginate(15)->withQueryString();

        return Inertia::render('admin/journal-users/create', [
            'availableUsers' => $availableUsers,
            'roles' => self::JOURNAL_ROLES,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Assign a user to the current journal with a role.
     */
    public function store(AssignJournalUserRequest $request): RedirectResponse
    {
        $journal = app('currentJournal');
        $data = $request->validated();

        $user = User::findOrFail($data['user_id']);

        // Check if user is already assigned with this role
        $exists = DB::table('journal_user')
            ->where('journal_id', $journal->id)
            ->where('user_id', $user->id)
            ->where('role', $data['role'])
            ->exists();

        if ($exists) {
            return redirect()
                ->route('admin.journal-users.index')
                ->with('error', 'User is already assigned to this journal with that role.');
        }

        $journal->users()->attach($user->id, [
            'role' => $data['role'],
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        return redirect()
            ->route('admin.journal-users.index')
            ->with('success', "{$user->firstname} {$user->lastname} has been assigned as {$data['role']}.");
    }

    /**
     * Show the form for editing a journal-user assignment.
     */
    public function edit(int $pivotId): Response
    {
        $journal = app('currentJournal');

        $pivot = DB::table('journal_user')
            ->where('id', $pivotId)
            ->where('journal_id', $journal->id)
            ->first();

        if (! $pivot) {
            abort(404);
        }

        $user = User::select('id', 'firstname', 'lastname', 'email', 'role', 'affiliation')
            ->findOrFail($pivot->user_id);

        return Inertia::render('admin/journal-users/edit', [
            'journalUser' => [
                'pivot_id' => $pivot->id,
                'user' => $user,
                'role' => $pivot->role,
                'is_active' => (bool) $pivot->is_active,
                'assigned_at' => $pivot->assigned_at,
            ],
            'roles' => self::JOURNAL_ROLES,
        ]);
    }

    /**
     * Update the journal-user assignment.
     */
    public function update(UpdateJournalUserRequest $request, int $pivotId): RedirectResponse
    {
        $journal = app('currentJournal');

        $pivot = DB::table('journal_user')
            ->where('id', $pivotId)
            ->where('journal_id', $journal->id)
            ->first();

        if (! $pivot) {
            abort(404);
        }

        $data = $request->validated();

        // Check for duplicate role assignment if role changed
        if ($data['role'] !== $pivot->role) {
            $duplicate = DB::table('journal_user')
                ->where('journal_id', $journal->id)
                ->where('user_id', $pivot->user_id)
                ->where('role', $data['role'])
                ->where('id', '!=', $pivotId)
                ->exists();

            if ($duplicate) {
                return redirect()
                    ->back()
                    ->with('error', 'User already has this role in the journal.');
            }
        }

        DB::table('journal_user')
            ->where('id', $pivotId)
            ->update([
                'role' => $data['role'],
                'is_active' => $data['is_active'],
                'updated_at' => now(),
            ]);

        return redirect()
            ->route('admin.journal-users.index')
            ->with('success', 'Journal user assignment updated successfully.');
    }

    /**
     * Remove a user's role assignment from the journal.
     */
    public function destroy(int $pivotId): RedirectResponse
    {
        $journal = app('currentJournal');

        $deleted = DB::table('journal_user')
            ->where('id', $pivotId)
            ->where('journal_id', $journal->id)
            ->delete();

        if (! $deleted) {
            abort(404);
        }

        return redirect()
            ->route('admin.journal-users.index')
            ->with('success', 'User removed from journal successfully.');
    }

    /**
     * Toggle the active status of a journal-user assignment.
     */
    public function toggleStatus(int $pivotId): RedirectResponse
    {
        $journal = app('currentJournal');

        $pivot = DB::table('journal_user')
            ->where('id', $pivotId)
            ->where('journal_id', $journal->id)
            ->first();

        if (! $pivot) {
            abort(404);
        }

        DB::table('journal_user')
            ->where('id', $pivotId)
            ->update([
                'is_active' => ! $pivot->is_active,
                'updated_at' => now(),
            ]);

        $status = $pivot->is_active ? 'deactivated' : 'activated';

        return redirect()
            ->back()
            ->with('success', "User assignment {$status} successfully.");
    }
}
