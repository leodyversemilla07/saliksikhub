import { AnnouncementBanner } from '@/components/plugins/announcement-banner';
import AnnouncementBannerSettings from '@/components/plugins/announcement-banner-settings';
import { CitationTool } from '@/components/plugins/citation-tool';
import CitationToolSettings from '@/components/plugins/citation-tool-settings';
import { registerPluginComponent } from '@/components/plugins/plugin-slot';
import { registerPluginSettingsForm } from '@/plugins/settings-registry';

/**
 * Register plugin components that can be injected via PluginSlot.
 * This runs once when the application boots.
 */
export function registerCorePluginComponents(): void {
    registerPluginComponent('announcement_banner', AnnouncementBanner);
    registerPluginComponent('citation_tool', CitationTool);

    // Register custom settings forms for each plugin
    registerPluginSettingsForm('citation-tool', CitationToolSettings);
    registerPluginSettingsForm(
        'announcement-banner',
        AnnouncementBannerSettings,
    );
}
