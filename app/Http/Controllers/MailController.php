<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\TestMail;

class MailController extends Controller
{
    /**
     * Send test email
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $mailData = [
                'title' => 'The Title',
                'body' => 'The Body'
            ];

            Mail::to('leodyversemilla07@gmail.com')->send(new TestMail($mailData));

            return response()->json([
                'status' => 'success',
                'message' => 'Email sent successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send custom email
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function sendCustomMail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'title' => 'required|string',
            'body' => 'required|string'
        ]);

        try {
            $mailData = [
                'title' => $request->title,
                'body' => $request->body
            ];

            Mail::to($request->email)->send(new TestMail($mailData));

            return response()->json([
                'status' => 'success',
                'message' => 'Email sent successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send email: ' . $e->getMessage()
            ], 500);
        }
    }
}
