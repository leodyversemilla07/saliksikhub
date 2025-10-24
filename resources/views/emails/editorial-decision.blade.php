<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Editorial Decision</title>
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

        .decision-box {
            padding: 20px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 5px solid;
        }

        .decision-accept {
            background-color: #d4edda;
            border-left-color: #28a745;
        }

        .decision-revision {
            background-color: #fff3cd;
            border-left-color: #ffc107;
        }

        .decision-reject {
            background-color: #f8d7da;
            border-left-color: #dc3545;
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

        .comments {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Editorial Decision</h1>
        </div>

        <div class="content">
            <p>Dear {{ $manuscript->user->firstname }} {{ $manuscript->user->lastname }},</p>

            <p>An editorial decision has been made regarding your manuscript.</p>

            <div
                class="decision-box
                @if ($decision->decision === 'accept') decision-accept
                @elseif(in_array($decision->decision, ['minor_revision', 'major_revision'])) decision-revision
                @else decision-reject @endif">

                <h3>{{ $manuscript->title }}</h3>
                <h4>Decision: {{ ucwords(str_replace('_', ' ', $decision->decision)) }}</h4>

                @if ($decision->comments)
                    <div class="comments">
                        <strong>Editorial Comments:</strong><br>
                        {{ $decision->comments }}
                    </div>
                @endif

                <p><strong>Decision Date:</strong> {{ $decision->created_at->format('M j, Y') }}</p>
                <p><strong>Manuscript ID:</strong> {{ $manuscript->id }}</p>
            </div>

            @if ($decision->decision === 'accept')
                <p>Congratulations! Your manuscript has been accepted for publication. Our editorial team will be in
                    touch with next steps regarding the publication process.</p>
            @elseif($decision->decision === 'minor_revision')
                <p>Your manuscript requires minor revisions. Please review the editorial comments and submit your
                    revised manuscript within the specified timeframe.</p>
            @elseif($decision->decision === 'major_revision')
                <p>Your manuscript requires major revisions. Please review the editorial comments carefully and submit
                    your revised manuscript within the specified timeframe.</p>
            @else
                <p>We regret to inform you that your manuscript has not been accepted for publication at this time. We
                    appreciate your submission and encourage you to consider submitting future work.</p>
            @endif

            <p>You can view the full details of your manuscript and the editorial decision by clicking the button below:
            </p>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{ $manuscriptUrl }}" class="button">View Manuscript</a>
            </p>

            <p>If you have any questions about this decision, please contact the editorial team.</p>

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
