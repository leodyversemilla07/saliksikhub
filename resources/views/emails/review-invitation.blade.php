<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Review Invitation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }

        .content {
            margin-bottom: 20px;
        }

        .manuscript-info {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }

        .deadline {
            background-color: #fff3cd;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin: 5px;
            text-align: center;
        }

        .accept-button {
            background-color: #28a745;
            color: white;
        }

        .decline-button {
            background-color: #dc3545;
            color: white;
        }

        .view-button {
            background-color: #007bff;
            color: white;
        }

        .footer {
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Review Invitation</h1>
        </div>

        <div class="content">
            <p>Dear {{ $review->reviewer->firstname }} {{ $review->reviewer->lastname }},</p>

            <p>You have been invited to review a manuscript submitted to our journal. Your expertise in this area would
                be greatly appreciated.</p>

            <div class="manuscript-info">
                <h3>{{ $manuscript->title }}</h3>
                <p><strong>Authors:</strong> {{ $manuscript->user->firstname }} {{ $manuscript->user->lastname }}</p>
                <p><strong>Manuscript ID:</strong> {{ $manuscript->id }}</p>
                <p><strong>Submitted:</strong> {{ $manuscript->created_at->format('M j, Y') }}</p>
                @if ($manuscript->abstract)
                    <p><strong>Abstract Preview:</strong></p>
                    <p style="font-style: italic;">{{ Str::limit($manuscript->abstract, 300) }}</p>
                @endif
            </div>

            @if ($review->due_date)
                <div class="deadline">
                    <strong>Review Due Date:</strong> {{ $review->due_date->format('M j, Y') }}
                    <br><em>Please complete your review by this date to help maintain our publication timeline.</em>
                </div>
            @endif

            <p>As a reviewer, you will be asked to provide:</p>
            <ul>
                <li>An overall recommendation (accept, minor revisions, major revisions, reject)</li>
                <li>Detailed comments for the author</li>
                <li>Confidential comments for the editor</li>
                <li>Ratings on various criteria</li>
            </ul>

            <p>Please review the manuscript carefully and provide constructive feedback that will help improve the work.
            </p>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{ $acceptUrl }}" class="button accept-button">Accept Review Invitation</a>
                <a href="{{ $declineUrl }}" class="button decline-button">Decline Invitation</a>
                <br><br>
                <a href="{{ $reviewUrl }}" class="button view-button">View Review Details</a>
            </p>

            <p>If you have any questions about the review process or need additional information, please contact the
                editorial team.</p>

            <p>Thank you for your contribution to the scholarly community.</p>

            <p>Best regards,<br>
                The Editorial Team</p>
        </div>

        <div class="footer">
            <p>This is an automated invitation from the manuscript submission system. Please do not reply to this email.
            </p>
            <p>If you are unable to review this manuscript, please decline the invitation so we can invite another
                reviewer.</p>
        </div>
    </div>
</body>

</html>
