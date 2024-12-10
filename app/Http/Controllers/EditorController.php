<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\ReviewerAssignment;
use Inertia\Inertia;
use App\Models\Manuscript;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ReviewerInvitation as ReviewerInvitationNotification;
use App\Notifications\ManuscriptDecision as ManuscriptDecisionNotification;

class EditorController extends Controller
{
    private const STATUSES = [
        'ACCEPTED' => 'accepted',
        'REJECTED' => 'rejected',
        'REVISION_REQUIRED' => 'revision_required',
        'UNDER_REVIEW' => 'under_review',
        'SUBMITTED' => 'submitted'
    ];

    private const MANUSCRIPT_STATUSES = [
        'accept' => self::STATUSES['ACCEPTED'],
        'reject' => self::STATUSES['REJECTED'],
        'revision' => self::STATUSES['REVISION_REQUIRED']
    ];

    // Dashboard and Index Methods
    public function index()
    {
        return Inertia::render("Editor/EditorDashboard", [
            'stats' => $this->getDashboardStats()
        ]);
    }

    public function indexManuscripts()
    {
        return Inertia::render('Editor/Index', [
            'manuscripts' => Manuscript::with('author')
                ->where('status', self::STATUSES['SUBMITTED'])
                ->latest()
                ->get()
        ]);
    }

    public function indexManuscriptsAssign()
    {
        return Inertia::render('Editor/AssignReviewer', [
            'manuscripts' => Manuscript::with(['author', 'reviewerAssignments'])
                ->where('status', self::STATUSES['ACCEPTED'])
                ->latest()
                ->get(),
            'reviewers' => User::role('reviewer')->get()
        ]);
    }

    public function show($id)
    {
        $manuscript = Manuscript::with(['author', 'reviewerAssignments.reviewer', 'reviewerAssignments.review'])
            ->findOrFail($id);

        return Inertia::render('Manuscripts/Show', [
            'manuscript' => $this->formatManuscriptData($manuscript)
        ]);
    }

    // Reviewer Management Methods
    public function getPotentialReviewers(Manuscript $manuscript)
    {
        return response()->json(
            User::role('reviewer')
                ->whereNotIn('id', $manuscript->reviewerAssignments()->pluck('reviewer_id'))
                ->select(['id', 'name', 'email', 'expertise'])
                ->get()
        );
    }

    public function assignReviewer(Request $request, Manuscript $manuscript)
    {
        $this->validateReviewerAssignment($request);

        $reviewer = User::findOrFail($request->reviewer_id);
        $assignment = $this->createReviewerAssignment($manuscript, $reviewer, $request->due_date);

        return response()->json([
            'message' => 'Reviewer assigned successfully',
            'assignment' => $assignment
        ]);
    }

    public function removeReviewer(Manuscript $manuscript, User $reviewer)
    {
        $manuscript->reviewerAssignments()
            ->where('reviewer_id', $reviewer->id)
            ->delete();

        return response()->json(['message' => 'Reviewer removed successfully']);
    }

    // Manuscript Management Methods
    public function makeDecision(Request $request, Manuscript $manuscript)
    {
        $this->validateDecision($request);

        $status = self::MANUSCRIPT_STATUSES[$request->decision];
        $this->updateManuscriptDecision($manuscript, $status, $request->comments);

        return response()->json([
            'message' => 'Decision recorded successfully',
            'status' => $status
        ]);
    }

    public function getReviewProgress(Manuscript $manuscript)
    {
        return response()->json([
            'status' => $manuscript->getReviewStatus(),
            'assignments' => $manuscript->reviewerAssignments()
                ->with(['reviewer:id,name', 'review'])
                ->get()
        ]);
    }

    // Article Management Methods
    public function editArticles()
    {
        return Inertia::render('Editor/Articles', [
            'articles' => Article::with('author')->latest()->get()
        ]);
    }

    public function publishArticle(Article $article)
    {
        $article->update(['status' => 'published']);
        return redirect()->route('editor.editArticles')
            ->with('success', 'Article published successfully.');
    }

    // Private Helper Methods
    private function validateReviewerAssignment(Request $request)
    {
        return $request->validate([
            'reviewer_id' => 'required|exists:users,id',
            'due_date' => 'required|date|after:today'
        ]);
    }

    private function validateDecision(Request $request)
    {
        return $request->validate([
            'decision' => 'required|in:accept,reject,revision',
            'comments' => 'required|string|min:10'
        ]);
    }

    private function createReviewerAssignment(Manuscript $manuscript, User $reviewer, $dueDate)
    {
        $assignment = $manuscript->assignReviewer($reviewer, $dueDate);
        $manuscript->updateStatus(self::STATUSES['UNDER_REVIEW']);
        $reviewer->notify(new ReviewerInvitationNotification($assignment));

        return $assignment;
    }

    private function updateManuscriptDecision(Manuscript $manuscript, $status, $comments)
    {
        $manuscript->updateStatus($status);
        $manuscript->update([
            'editor_id' => Auth::id(),
            'decision_comments' => $comments,
            'decision_date' => now()
        ]);
        $manuscript->author->notify(new ManuscriptDecisionNotification($manuscript));
    }

    private function formatManuscriptData(Manuscript $manuscript)
    {
        return [
            'id' => $manuscript->id,
            'title' => $manuscript->title,
            'authors' => explode(', ', $manuscript->authors),
            'abstract' => $manuscript->abstract,
            'keywords' => explode(', ', $manuscript->keywords),
            'manuscript_url' => asset('storage/' . $manuscript->manuscript_path),
            'status' => $manuscript->status,
            'editor_comments' => $manuscript->decision_comments,
            'created_at' => $manuscript->created_at->toDateTimeString(),
            'updated_at' => $manuscript->updated_at->toDateTimeString(),
            'reviewer_assignments' => $manuscript->reviewerAssignments->map(function ($assignment) {
                return [
                    'id' => $assignment->id,
                    'reviewer' => $assignment->reviewer->name,
                    'due_date' => $assignment->due_date,
                    'status' => $assignment->status,
                    'review' => $assignment->review
                ];
            })
        ];
    }

    private function getDashboardStats()
    {
        return [
            'total_manuscripts' => Manuscript::count(),
            'pending_reviews' => Manuscript::where('status', self::STATUSES['UNDER_REVIEW'])->count(),
            'pending_decisions' => Manuscript::whereNull('decision_date')->count(),
            'published_articles' => Article::where('status', 'published')->count()
        ];
    }
}
