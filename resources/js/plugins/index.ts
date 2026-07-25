import {registerPluginComponent} from '@/components/plugins/plugin-slot';
import {AnnouncementBanner} from '@/components/plugins/announcement-banner';
import {CitationTool} from '@/components/plugins/citation-tool';
import {registerPluginSettingsForm} from '@/plugins/settings-registry';
import CitationToolSettings from '@/components/plugins/citation-tool-settings';
import AnnouncementBannerSettings from '@/components/plugins/announcement-banner-settings';

/**
 * Register plugin components that can be injected via PluginSlot.
 * This runs once when the application boots.
 */
export function registerCorePluginComponents(): void {
    registerPluginComponent('announcement_banner', AnnouncementBanner);
    registerPluginComponent('citation_tool', CitationTool);

    // Register custom settings forms for each plugin
    registerPluginSettingsForm('citation-tool', CitationToolSettings);
    registerPluginSettingsForm('announcement-banner', AnnouncementBannerSettings);
}
