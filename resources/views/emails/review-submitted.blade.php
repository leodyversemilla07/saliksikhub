<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Review Submitted</title>
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

        .confirmation {
            background-color: #d4edda;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 5px solid #28a745;
        }

        .review-summary {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }

        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
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
            <h1>Review Submitted Successfully</h1>
        </div>

        <div class="content">
            <p>Dear {{ $review->reviewer->firstname }} {{ $review->reviewer->lastname }},</p>

            <div class="confirmation">
                <h3>✓ Review Completed</h3>
                <p>Your review for the manuscript has been successfully submitted.</p>
            </div>

            <div class="review-summary">
                <h4>Review Summary</h4>
                <p><strong>Manuscript:</strong> {{ $manuscript->title }}</p>
                <p><strong>Manuscript ID:</strong> {{ $manuscript->id }}</p>
                <p><strong>Your Recommendation:</strong> {{ ucwords(str_replace('_', ' ', $review->recommendation)) }}
                </p>
                <p><strong>Submitted:</strong> {{ $review->review_submitted_at->format('M j, Y \a\t g:i A') }}</p>
                @if ($review->due_date)
                    <p><strong>Due Date:</strong> {{ $review->due_date->format('M j, Y') }}</p>
                @endif
            </div>

            <p>Thank you for your valuable contribution to the peer review process. Your feedback helps maintain the
                quality of our journal and supports the scholarly community.</p>

            <p>You can view the details of your submitted review by clicking the button below:</p>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{ $reviewUrl }}" class="button">View Review Details</a>
            </p>

            <p>Your review will now be considered by the editorial team in their decision-making process.</p>

            <p>Thank you once again for your time and expertise.</p>

            <p>Best regards,<br>
                The Editorial Team</p>
        </div>

        <div class="footer">
            <p>This is an automated confirmation from the manuscript submission system. Please do not reply to this
                email.</p>
        </div>
    </div>
</body>

</html>
