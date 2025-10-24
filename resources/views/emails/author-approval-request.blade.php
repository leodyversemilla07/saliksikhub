<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Manuscript Ready for Approval</title>
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

        .approval-notice {
            background-color: #d1ecf1;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 5px solid #17a2b8;
        }

        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
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
            <h1>Manuscript Ready for Your Approval</h1>
        </div>

        <div class="content">
            <p>Dear {{ $manuscript->user->firstname }} {{ $manuscript->user->lastname }},</p>

            <p>Great news! Your manuscript has been copyedited and is now ready for your final approval.</p>

            <div class="approval-notice">
                <h3>{{ $manuscript->title }}</h3>
                <p><strong>Manuscript ID:</strong> {{ $manuscript->id }}</p>
                <p><strong>Status:</strong> Ready for Author Approval</p>
                <p><strong>Copyediting Completed:</strong> {{ $manuscript->updated_at->format('M j, Y') }}</p>
            </div>

            <p>The editorial team has prepared a finalized version of your manuscript. Please review it carefully to
                ensure:</p>
            <ul>
                <li>All your content is present and correctly formatted</li>
                <li>Any editorial changes are acceptable</li>
                <li>The manuscript meets your standards for publication</li>
            </ul>

            <p>Once you approve the manuscript, it will move to the final publication stage. If you have any concerns or
                need changes, please contact the editorial team before approving.</p>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{ $approvalUrl }}" class="button">Review & Approve Manuscript</a>
            </p>

            <p><strong>Important:</strong> Please review and approve your manuscript within 7 days to avoid delays in
                the publication process.</p>

            <p>If you have any questions about the copyediting process or need assistance, please contact the editorial
                team.</p>

            <p>Best regards,<br>
                The Editorial Team</p>
        </div>

        <div class="footer">
            <p>This is an automated notification from the manuscript submission system. Please do not reply to this
                email.</p>
        </div>
    </div>
</body>

</html>
