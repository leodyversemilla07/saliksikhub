import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';
import type {PluginSettingsProps} from '@/plugins/settings-registry';

const FORMAT_OPTIONS = [
    {value: 'apa', label: 'APA 7th Edition'},
    {value: 'mla', label: 'MLA 9th Edition'},
    {value: 'chicago', label: 'Chicago 17th Edition'},
    {value: 'harvard', label: 'Harvard'},
    {value: 'vancouver', label: 'Vancouver'},
];

/**
 * Settings form for the Citation Tool plugin.
 *
 * Lets admins configure:
 * - Default citation format
 * - Which formats to enable
 * - Whether to show the copy button
 * - Custom format overrides
 */
export default function CitationToolSettings({
    settings,
    onUpdate,
}: PluginSettingsProps) {
    const availableFormats =
        (settings.availableFormats as string[]) || FORMAT_OPTIONS.map((f) => f.value);

    return (
        <div className="space-y-6">
            {/* Default Format */}
            <div className="grid gap-2">
                <Label htmlFor="defaultFormat">Default Citation Format</Label>
                <p className="text-sm text-muted-foreground">
                    The format selected by default when the citation tool opens.
                </p>
                <Select
                    value={(settings.defaultFormat as string) || 'apa'}
                    onValueChange={(value) => onUpdate('defaultFormat', value)}
                >
                    <SelectTrigger id="defaultFormat" className="max-w-xs">
                        <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                        {FORMAT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Available Formats */}
            <div className="grid gap-3">
                <Label>Available Formats</Label>
                <p className="text-sm text-muted-foreground">
                    Toggle which citation formats users can choose from.
                </p>
                <div className="space-y-3">
                    {FORMAT_OPTIONS.map((opt) => {
                        const isEnabled = availableFormats.includes(opt.value);

                        return (
                            <div
                                key={opt.value}
                                className="flex items-center justify-between rounded-lg border p-3"
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        {opt.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {opt.value.toUpperCase()}
                                    </p>
                                </div>
                                <Switch
                                    checked={isEnabled}
                                    onCheckedChange={(checked) => {
                                        const updated = checked
                                            ? [...availableFormats, opt.value]
                                            : availableFormats.filter(
                                                  (f) => f !== opt.value,
                                              );
                                        onUpdate(
                                            'availableFormats',
                                            updated,
                                        );
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Show Copy Button */}
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="showCopyButton">Show Copy Button</Label>
                    <p className="text-sm text-muted-foreground">
                        Display a "Copy to Clipboard" button on each citation.
                    </p>
                </div>
                <Switch
                    id="showCopyButton"
                    checked={(settings.showCopyButton as boolean) ?? true}
                    onCheckedChange={(checked) =>
                        onUpdate('showCopyButton', checked)
                    }
                />
            </div>

            {/* Custom Format Override */}
            <div className="grid gap-2">
                <Label htmlFor="formatOverride">Custom Format Template</Label>
                <p className="text-sm text-muted-foreground">
                    Override the default format template for all formats. Leave
                    empty to use the built-in templates.
                </p>
                <Textarea
                    id="formatOverride"
                    value={
                        (settings.formatOverride as string) || ''
                    }
                    onChange={(e) =>
                        onUpdate('formatOverride', e.target.value)
                    }
                    placeholder="e.g. {authors} ({year}). {title}. {journal}, {volume}({issue}), {pages}."
                    rows={3}
                />
            </div>

            {/* General Settings */}
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="enabled">Enable Citation Tool</Label>
                    <p className="text-sm text-muted-foreground">
                        Show the citation tool on manuscript public pages.
                    </p>
                </div>
                <Switch
                    id="enabled"
                    checked={(settings.enabled as boolean) ?? true}
                    onCheckedChange={(checked) => onUpdate('enabled', checked)}
                />
            </div>
        </div>
    );
}
