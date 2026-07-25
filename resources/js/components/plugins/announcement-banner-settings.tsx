import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { PluginSettingsProps } from '@/plugins/settings-registry';

const BANNER_TYPES = [
    { value: 'info', label: 'Info (Blue)', color: 'bg-blue-500' },
    { value: 'success', label: 'Success (Green)', color: 'bg-green-500' },
    { value: 'warning', label: 'Warning (Yellow)', color: 'bg-yellow-500' },
    { value: 'error', label: 'Error (Red)', color: 'bg-red-500' },
];

/**
 * Settings form for the Announcement Banner plugin.
 *
 * Lets admins configure:
 * - Banner message and type
 * - Dismissible behavior
 * - Custom link/CTAs
 * - Display rules (which pages)
 */
export default function AnnouncementBannerSettings({
    settings,
    onUpdate,
}: PluginSettingsProps) {
    return (
        <div className="space-y-6">
            {/* Enable / Disable */}
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="enabled">Enable Banner</Label>
                    <p className="text-sm text-muted-foreground">
                        Show the announcement banner on journal pages.
                    </p>
                </div>
                <Switch
                    id="enabled"
                    checked={(settings.enabled as boolean) ?? true}
                    onCheckedChange={(checked) => onUpdate('enabled', checked)}
                />
            </div>

            {/* Banner Message */}
            <div className="grid gap-2">
                <Label htmlFor="message">Announcement Message</Label>
                <p className="text-sm text-muted-foreground">
                    The message displayed in the banner. Supports basic HTML for
                    links.
                </p>
                <Textarea
                    id="message"
                    value={(settings.message as string) || ''}
                    onChange={(e) => onUpdate('message', e.target.value)}
                    placeholder="Welcome to our journal! Check out our latest issue."
                    rows={3}
                />
            </div>

            {/* Banner Type */}
            <div className="grid gap-2">
                <Label htmlFor="type">Banner Style</Label>
                <p className="text-sm text-muted-foreground">
                    The color/style of the announcement banner.
                </p>
                <Select
                    value={(settings.type as string) || 'info'}
                    onValueChange={(value) => onUpdate('type', value)}
                >
                    <SelectTrigger id="type" className="max-w-xs">
                        <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                        {BANNER_TYPES.map((bt) => (
                            <SelectItem key={bt.value} value={bt.value}>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`inline-block h-3 w-3 rounded-full ${bt.color}`}
                                    />
                                    {bt.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Dismissible */}
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="dismissible">Allow Dismissal</Label>
                    <p className="text-sm text-muted-foreground">
                        Users can dismiss the banner. It will stay hidden for
                        the session.
                    </p>
                </div>
                <Switch
                    id="dismissible"
                    checked={(settings.dismissible as boolean) ?? true}
                    onCheckedChange={(checked) =>
                        onUpdate('dismissible', checked)
                    }
                />
            </div>

            {/* Link URL */}
            <div className="grid gap-2">
                <Label htmlFor="linkUrl">Link URL (optional)</Label>
                <p className="text-sm text-muted-foreground">
                    If set, clicking the banner navigates to this URL.
                </p>
                <Input
                    id="linkUrl"
                    type="url"
                    value={(settings.linkUrl as string) || ''}
                    onChange={(e) => onUpdate('linkUrl', e.target.value)}
                    placeholder="https://example.com/announcement"
                />
            </div>

            {/* Link Text */}
            <div className="grid gap-2">
                <Label htmlFor="linkText">Link Button Text</Label>
                <p className="text-sm text-muted-foreground">
                    Text for the call-to-action button next to the banner
                    message.
                </p>
                <Input
                    id="linkText"
                    value={(settings.linkText as string) || ''}
                    onChange={(e) => onUpdate('linkText', e.target.value)}
                    placeholder="Learn more"
                    className="max-w-xs"
                />
            </div>
        </div>
    );
}
