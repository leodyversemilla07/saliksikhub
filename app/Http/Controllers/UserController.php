<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use App\Http\Requests\UserManagement\StoreRequest;
use App\Http\Requests\UserManagement\UpdateRequest;

class UserController extends Controller
{
    /**
     * Display a listing of the users (excluding the current user).
     */
    public function index(Request $request)
    {
        $perPageRaw = $request->input('per_page', 10);

        $perPage = is_numeric($perPageRaw) ? (int)$perPageRaw : $perPageRaw;

        $query = User::where('id', '!=', Auth::id())
            ->orderBy('created_at', 'desc');

        // If perPage is -1 or 'all', return all users in one page
        if ($perPage === -1 || $perPage === 'all') {
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
            // Validate perPage
            if (!is_numeric($perPage) || $perPage < 1 || $perPage > 100) {
                $perPage = 10;
            }
            $paginator = $query->paginate($perPage)->withQueryString();
        }

        return Inertia::render('user-management/index', [
            'users' => $paginator->items(),
            'pagination' => [
                'links' => $paginator->links(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                ],
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $allRoles = Role::pluck('name')->toArray();
        return Inertia::render('user-management/create', [
            'roles' => $allRoles,
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : []
        ]);
    }

    /**
     * Store a newly created user in the database.
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
        return redirect()->back()->with('success', 'User created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('user-management/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $allRoles = Role::pluck('name')->toArray();
        $user = User::findOrFail($id);
        return Inertia::render('user-management/edit', [
            'user' => $user,
            'roles' => $allRoles,
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : []
        ]);
    }

    /**
     * Update the specified user's information.
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
     * Delete the specified user from the database.
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
     * Delete multiple users from the database (custom route).
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

        return redirect()->back()->with('success', count($userIds) . ' users deleted successfully');
    }
}
