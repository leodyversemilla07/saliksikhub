<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AdminController extends Controller
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function index()
    {
        $stats = $this->getDashboardStats();
        return Inertia::render("Admin/AdminDashboard", compact('stats'));
    }

    public function manageUsers()
    {
        $users = $this->getUsersExceptCurrent();
        $roles = $this->getAllRoles();
        return Inertia::render('Admin/UserManagement', compact('users', 'roles'));
    }

    public function store(UserStoreRequest $request)
    {
        try {
            $user = $this->createUser($request->validated());
            return $this->successResponse('User created successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create user: ' . $e->getMessage());
        }
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        try {
            $this->updateUser($user, $request->validated());
            return $this->successResponse('User updated successfully');
        } catch (\Exception $error) {
            return $this->errorResponse('Failed to update user: ' . $error->getMessage());
        }
    }

    public function destroy(User $user)
    {
        try {
            if ($user->id === Auth::id()) {
                return $this->errorResponse('You cannot delete your own account');
            }
            $user->delete();
            return $this->successResponse('User deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete user');
        }
    }

    public function show(User $user)
    {
        try {
            $userData = $this->transformUser($user);
            return Inertia::render('Admin/UserDetail', compact('userData'));
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('User not found');
        }
    }

    private function getDashboardStats()
    {
        return [
            'total_users' => $this->user->count(),
            'active_users' => $this->user->where('status', 'active')->count(),
            'admin_users' => $this->user->role('admin')->count(),
            'recent_users' => $this->user->latest()->take(5)->get()
                ->map(fn($user) => $this->transformUser($user)),
        ];
    }

    private function getUsersExceptCurrent()
    {
        return $this->user
            ->where('id', '!=', Auth::id())
            ->with('roles')
            ->latest()
            ->get()
            ->map(fn($user) => $this->transformUser($user));
    }

    private function getAllRoles()
    {
        return \Spatie\Permission\Models\Role::all()
            ->pluck('name');
    }

    private function transformUser($user)
    {
        return [
            'id' => $user->id,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'email' => $user->email,
            'roles' => $user->getRoleNames()->toArray(),
            'status' => $user->status ?? 'active',
            'created_at' => $user->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $user->updated_at->format('Y-m-d H:i:s'),
        ];
    }

    private function createUser(array $data)
    {
        $user = $this->user->create([
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'status' => $data['status'] ?? 'active',
        ]);

        $user->assignRole($data['roles']);
        return $user;
    }

    private function updateUser(User $user, array $data)
    {
        $updateData = [
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'],
            'email' => $data['email'],
        ];

        if (isset($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        if (isset($data['status'])) {
            $updateData['status'] = $data['status'];
        }

        $user->update($updateData);
        $user->syncRoles($data['roles']);

        return $user;
    }

    private function successResponse($message)
    {
        return back()->with('success', $message);
    }

    private function errorResponse($message)
    {
        return back()->with('error', $message)->withInput();
    }
}
