<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Server Error') - {{ config('app.name', 'SaliksikHub') }}</title>
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
        .container {
            max-width: 480px;
            text-align: center;
        }
        .status-code {
            font-size: 6rem;
            font-weight: 800;
            line-height: 1;
            background: linear-gradient(135deg, #ef4444, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
        }
        h1 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
        }
        p {
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .actions {
            display: flex;
            gap: 0.75rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.625rem 1.25rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.15s ease;
        }
        .btn-primary {
            background: #2563eb;
            color: #fff;
        }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-secondary {
            background: #e2e8f0;
            color: #334155;
        }
        .btn-secondary:hover { background: #cbd5e1; }
        .icon { font-size: 1.25rem; }
        .footer {
            margin-top: 3rem;
            font-size: 0.75rem;
            color: #94a3b8;
        }
        .detail-card {
            background: #f1f5f9;
            border-radius: 0.75rem;
            padding: 1.25rem;
            text-align: left;
            margin-bottom: 1.5rem;
            font-size: 0.8125rem;
        }
        .detail-card dt {
            font-weight: 600;
            color: #475569;
            margin-top: 0.75rem;
        }
        .detail-card dt:first-child { margin-top: 0; }
        .detail-card dd {
            color: #64748b;
            margin-top: 0.125rem;
            font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
            font-size: 0.75rem;
            word-break: break-word;
        }
        @media (prefers-color-scheme: dark) {
            body { background: #0f172a; color: #e2e8f0; }
            p { color: #94a3b8; }
            .btn-secondary { background: #1e293b; color: #e2e8f0; }
            .btn-secondary:hover { background: #334155; }
            .detail-card { background: #1e293b; }
            .detail-card dt { color: #94a3b8; }
            .detail-card dd { color: #64748b; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="status-code">500</div>
        <h1>Server Error</h1>
        <p>Something went wrong on our end. We've been notified and are working on a fix. Please try again later.</p>
        <div class="actions">
            <a href="{{ url('/') }}" class="btn btn-primary">
                <span class="icon">&larr;</span> Back to Home
            </a>
            <a href="{{ url()->previous() }}" class="btn btn-secondary">
                Go Back
            </a>
        </div>
        @if (config('app.debug'))
        <div class="detail-card">
            <dl>
                <dt>Error</dt>
                <dd>{{ $exception->getMessage() ?? 'Unknown error' }}</dd>
                <dt>File</dt>
                <dd>{{ $exception->getFile() ?? 'N/A' }}</dd>
                <dt>Line</dt>
                <dd>{{ $exception->getLine() ?? 'N/A' }}</dd>
                @if (method_exists($exception, 'getStatusCode'))
                <dt>Status</dt>
                <dd>{{ $exception->getStatusCode() }}</dd>
                @endif
            </dl>
        </div>
        @endif
        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name', 'SaliksikHub') }}. All rights reserved.
        </div>
    </div>
</body>
</html>
