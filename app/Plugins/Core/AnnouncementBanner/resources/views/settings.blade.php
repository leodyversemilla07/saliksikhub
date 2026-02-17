<!DOCTYPE html>
<html>
<head>
    <title>Announcement Banner Settings</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input[type="text"], textarea, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        input[type="checkbox"] { margin-right: 5px; }
        .btn { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <h1>Announcement Banner Settings</h1>
    
    <form method="POST" action="">
        <div class="form-group">
            <label>
                <input type="checkbox" name="enabled" <?= $settings['enabled'] ? 'checked' : '' ?>>
                Enable Banner
            </label>
        </div>

        <div class="form-group">
            <label for="message">Announcement Message</label>
            <textarea id="message" name="message" rows="3"><?= htmlspecialchars($settings['message'] ?? '') ?></textarea>
        </div>

        <div class="form-group">
            <label for="type">Banner Type</label>
            <select id="type" name="type">
                <option value="info" <?= ($settings['type'] ?? '') === 'info' ? 'selected' : '' ?>>Info (Blue)</option>
                <option value="success" <?= ($settings['type'] ?? '') === 'success' ? 'selected' : '' ?>>Success (Green)</option>
                <option value="warning" <?= ($settings['type'] ?? '') === 'warning' ? 'selected' : '' ?>>Warning (Yellow)</option>
                <option value="error" <?= ($settings['type'] ?? '') === 'error' ? 'selected' : '' ?>>Error (Red)</option>
            </select>
        </div>

        <div class="form-group">
            <label>
                <input type="checkbox" name="dismissible" <?= ($settings['dismissible'] ?? true) ? 'checked' : '' ?>>
                Allow users to dismiss banner
            </label>
        </div>

        <button type="submit" class="btn">Save Settings</button>
    </form>
</body>
</html>
