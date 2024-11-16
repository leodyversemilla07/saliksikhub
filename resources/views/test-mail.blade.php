<!DOCTYPE html>
<html>

<head>
    <title>MinSU Research Journal</title>
    <style>
        /* General Reset */
        body,
        html {
            margin: 0;
            padding: 0;
            font-family: 'Georgia', serif;
            background-color: #f4f4f4;
            color: #333333;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #ddd;
        }

        .email-header {
            background-color: #00274d;
            /* Dark blue */
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }

        .email-body {
            padding: 30px;
            line-height: 1.6;
        }

        h1 {
            font-size: 22px;
            color: #00274d;
            font-weight: bold;
            margin-bottom: 10px;
        }

        p {
            font-size: 16px;
            margin: 15px 0;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #00274d;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }

        .button:hover {
            background-color: #004080;
        }

        .footer {
            background-color: #f8f8f8;
            text-align: center;
            font-size: 12px;
            color: #555555;
            padding: 20px;
            border-top: 1px solid #eeeeee;
        }

        .footer a {
            color: #00274d;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            MinSU Research Journal
        </div>
        <div class="email-body">
            <h1>{{ $data['title'] }}</h1>
            <p>{{ $data['body'] }}</p>
            <p>Thank you for your attention,</p>
            <p>Sincerely,</p>
            <p>The MinSU Research Journal Team</p>
            <a href="https://minsu.edu.ph/research-journal" class="button">Visit Our Website</a>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} MinSU Research Journal. All rights reserved.</p>
            <p><a href="https://minsu.edu.ph/research-journal">Privacy Policy</a> | <a
                    href="https://minsu.edu.ph/research-journal/contact">Contact Us</a></p>
        </div>
    </div>
</body>

</html>
