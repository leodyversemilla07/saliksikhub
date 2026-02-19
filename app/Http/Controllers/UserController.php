<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserManagement\StoreRequest;
use App\Http\Requests\UserManagement\UpdateRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Returns a paginated list of users, excluding the current user, with optional role and search filters.
     * Scoped to the current journal when available.
     */
    public function index(Request $request)
    {
        $journal = app()->bound('currentJournal') ? app('currentJournal') : null;

        $pageSizeRaw = $request->input('per_page', 6);
        $role = $request->input('role');
        $search = $request->input('search');

        $pageSize = ($pageSizeRaw === 'all') ? -1 : (is_numeric($pageSizeRaw) ? (int) $pageSizeRaw : $pageSizeRaw);

        // Scope users to current journal if available
        if ($journal) {
            $query = User::whereHas('journals', fn ($q) => $q->where('journals.id', $journal->id))
                ->where('id', '!=', Auth::id())
                ->orderBy('created_at', 'desc');
        } else {
            $query = User::where('id', '!=', Auth::id())
                ->orderBy('created_at', 'desc');
        }

        if ($role && $role !== 'all') {
            $query->where('role', $role);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('firstname', 'like', "%{$search}%")
                    ->orWhere('lastname', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('country', 'like', "%{$search}%")
                    ->orWhere('affiliation', 'like', "%{$search}%");
            });
        }

        if ($pageSize === -1 || $pageSize === 'all') {
            $allUsers = $query->get();
            $total = $allUsers->count();
            $currentPage = 1;
            $paginator = new LengthAwarePaginator(
                $allUsers,
                $total,
                $total > 0 ? $total : 1,
                $currentPage,
                [
                    'path' => $request->url(),
                    'query' => $request->query(),
                ]
            );
        } else {
            if (! is_numeric($pageSize) || $pageSize < 1 || $pageSize > 100) {
                $pageSize = 10;
            }
            $paginator = $query->paginate($pageSize)->withQueryString();
        }

        return Inertia::render('user-management/index', [
            'users' => $paginator->items(),
            'pagination' => [
                'links' => $paginator->links(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => ($pageSize === -1 ? $paginator->total() : $paginator->perPage()),
                    'total' => $paginator->total(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                ],
            ],
        ]);
    }

    /**
     * Displays the form to create a new user and select a role.
     */
    public function create()
    {
        $allRoles = Role::pluck('name')->toArray();

        return Inertia::render('user-management/create', [
            'roles' => $allRoles,
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : [],
        ]);
    }

    /**
     * Creates a new user in the database and assigns the selected role.
     * Also attaches the user to the current journal if available.
     */
    public function store(StoreRequest $request)
    {
        $validated = $request->validated();
        $user = User::create([
            'firstname' => $validated['firstname'],
            'lastname' => $validated['lastname'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'affiliation' => $validated['affiliation'] ?? null,
            'country' => $validated['country'] ?? null,
            'role' => $validated['role'],
        ]);
        $user->assignRole($validated['role']);

        // Attach user to current journal
        $journal = app()->bound('currentJournal') ? app('currentJournal') : null;
        if ($journal) {
            $user->journals()->attach($journal->id, [
                'role' => $validated['role'],
                'is_active' => true,
                'assigned_at' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'User created successfully');
    }

    /**
     * Displays details of the specified user.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('user-management/show', [
            'user' => $user,
        ]);
    }

    /**
     * Displays the form to edit an existing user's information and role.
     */
    public function edit(string $id)
    {
        $allRoles = Role::pluck('name')->toArray();
        $user = User::findOrFail($id);

        return Inertia::render('user-management/edit', [
            'user' => $user,
            'roles' => $allRoles,
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : [],
        ]);
    }

    /**
     * Updates the information and role of the specified user.
     */
    public function update(UpdateRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validated();
        $user->firstname = $validated['firstname'];
        $user->lastname = $validated['lastname'];
        $user->username = $validated['username'];
        $user->email = $validated['email'];
        $user->affiliation = $validated['affiliation'] ?? null;
        $user->country = $validated['country'] ?? null;
        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();
        $user->syncRoles([$validated['role']]);

        return redirect()->back()->with('success', 'User updated successfully');
    }

    /**
     * Deletes the specified user from the database, preventing self-deletion.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }

    /**
     * Deletes multiple users from the database, preventing self-deletion.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'userIds' => 'required|array',
            'userIds.*' => 'exists:users,id',
        ]);

        $userIds = $request->userIds;

        if (in_array(Auth::id(), $userIds)) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
                'errors' => ['userIds' => 'Your account was included in the selection and cannot be deleted.'],
            ], 422);
        }

        User::whereIn('id', $userIds)->delete();

        return redirect()->back()->with('success', count($userIds).' users deleted successfully');
    }
}
