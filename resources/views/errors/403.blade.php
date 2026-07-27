<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Forbidden') - {{ config('app.name', 'SaliksikHub') }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f8fafc;
            color: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
        }
        .container { max-width: 480px; text-align: center; }
        .status-code {
            font-size: 6rem; font-weight: 800; line-height: 1;
            background: linear-gradient(135deg, #dc2626, #f97316);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
        }
        h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
        p { color: #64748b; line-height: 1.6; margin-bottom: 2rem; }
        .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
        .btn {
            display: inline-flex; align-items: center; gap: 0.5rem;
            padding: 0.625rem 1.25rem; border-radius: 0.5rem;
            font-size: 0.875rem; font-weight: 500; text-decoration: none;
            transition: all 0.15s ease;
        }
        .btn-primary { background: #2563eb; color: #fff; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-secondary { background: #e2e8f0; color: #334155; }
        .btn-secondary:hover { background: #cbd5e1; }
        .icon { font-size: 1.25rem; }
        .footer { margin-top: 3rem; font-size: 0.75rem; color: #94a3b8; }
        @media (prefers-color-scheme: dark) {
            body { background: #0f172a; color: #e2e8f0; }
            p { color: #94a3b8; }
            .btn-secondary { background: #1e293b; color: #e2e8f0; }
            .btn-secondary:hover { background: #334155; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="status-code">403</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this resource. Contact your administrator if you think this is a mistake.</p>
        <div class="actions">
            <a href="{{ url('/') }}" class="btn btn-primary">
                <span class="icon">&larr;</span> Back to Home
            </a>
            <a href="{{ route('login') }}" class="btn btn-secondary">
                Sign In
            </a>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name', 'SaliksikHub') }}. All rights reserved.
        </div>
    </div>
</body>
</html>
