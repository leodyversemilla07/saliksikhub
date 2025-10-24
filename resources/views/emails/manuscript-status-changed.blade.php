<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Manuscript Status Updated</title>
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

        .status-change {
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
            <h1>Manuscript Status Updated</h1>
        </div>

        <div class="content">
            <p>Dear {{ $manuscript->user->firstname }} {{ $manuscript->user->lastname }},</p>

            <p>The status of your manuscript has been updated.</p>

            <div class="status-change">
                <h3>{{ $manuscript->title }}</h3>
                <p><strong>Previous Status:</strong> {{ ucwords(str_replace('_', ' ', $oldStatus)) }}</p>
                <p><strong>New Status:</strong> {{ ucwords(str_replace('_', ' ', $newStatus)) }}</p>
                <p><strong>Manuscript ID:</strong> {{ $manuscript->id }}</p>
                <p><strong>Submitted:</strong> {{ $manuscript->created_at->format('M j, Y') }}</p>
            </div>

            <p>You can view the full detaCreate the OpenSpec change proposal with detailed requirementsils of your
                manuscript by clicking the button below:</p>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{ $manuscriptUrl }}" class="button">View Manuscript</a>
            </p>

            <p>If you have any questions about this status change, please contact the editorial team.</p>

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
