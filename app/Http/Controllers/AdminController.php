<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function index()
    {
        return Inertia::render("Admin/AdminDashboard");
    }

    public function manageUsers()
    {
        $users = $this->getUsersExceptCurrent();
        return Inertia::render('Admin/UserManagement', compact('users'));
    }

    public function store(UserStoreRequest $request)
    {
        try {
            $user = $this->createUser($request->validated());
            return $this->successResponse('User created successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create user');
        }
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        try {
            $this->updateUser($user, $request->validated());
            return $this->successResponse('User updated successfully');
        } catch (\Exception $error) {
            return $this->errorResponse('Failed to update user');
        }
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('manageUsers')
            ->with('success', 'User deleted successfully.');
    }

    private function getUsersExceptCurrent()
    {
        return $this->user
            ->where('id', '!=', Auth::id())
            ->get()
            ->map(fn($user) => $this->transformUser($user));
    }

    private function transformUser($user)
    {
        return [
            'id' => $user->id,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'email' => $user->email,
            'roles' => $user->getRoleNames()->toArray(),
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }

    private function createUser(array $data)
    {
        $user = $this->user->create([
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->assignRole($data['roles']);
        return $user;
    }

    private function updateUser(User $user, array $data)
    {
        $user->update([
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'],
            'email' => $data['email'],
        ]);

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
