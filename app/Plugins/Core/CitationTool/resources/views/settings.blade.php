<h2>Citation Tool Settings</h2>
<form method="POST" action="/admin/plugins/citation-tool/settings">
    @csrf
    <label>
        Default Format:
        <select name="defaultFormat">
            <option value="apa" {{ ($settings['defaultFormat'] ?? 'apa') === 'apa' ? 'selected' : '' }}>APA</option>
            <option value="mla" {{ ($settings['defaultFormat'] ?? 'apa') === 'mla' ? 'selected' : '' }}>MLA</option>
            <option value="chicago" {{ ($settings['defaultFormat'] ?? 'apa') === 'chicago' ? 'selected' : '' }}>Chicago</option>
            <option value="harvard" {{ ($settings['defaultFormat'] ?? 'apa') === 'harvard' ? 'selected' : '' }}>Harvard</option>
            <option value="vancouver" {{ ($settings['defaultFormat'] ?? 'apa') === 'vancouver' ? 'selected' : '' }}>Vancouver</option>
        </select>
    </label>
    <label>
        <input type="checkbox" name="showCopyButton" value="1" {{ ($settings['showCopyButton'] ?? true) ? 'checked' : '' }}>
        Show Copy Button
    </label>
    <button type="submit">Save</button>
</form>
