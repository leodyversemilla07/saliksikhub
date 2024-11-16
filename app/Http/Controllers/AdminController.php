<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        // Display admin dashboard
        return Inertia::render("Admin/AdminDashboard");
    }

    public function manageUsers()
    {
        // List all users
        $users = User::all();
        return view('admin.manage_users', compact('users'));
    }

    public function createUser(Request $request)
    {
        // Validate and create a new user
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string',
        ]);

        $user = User::create($request->only('name', 'email', 'password'));
        $user->assignRole($request->role);

        return redirect()->route('admin.manageUsers')->with('success', 'User created successfully.');
    }

    public function editUser(User $user)
    {
        // Show edit form for a user
        return view('admin.edit_user', compact('user'));
    }

    public function updateUser(Request $request, User $user)
    {
        // Validate and update user details
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string',
        ]);

        $user->update($request->only('name', 'email'));
        $user->syncRoles($request->role);

        return redirect()->route('admin.manageUsers')->with('success', 'User updated successfully.');
    }

    public function deleteUser(User $user)
    {
        // Delete a user
        $user->delete();
        return redirect()->route('admin.manageUsers')->with('success', 'User deleted successfully.');
    }
}
