/**
 * Plugin settings form registry.
 *
 * Plugins register their custom settings React components here.
 * The admin settings page checks this registry and renders the
 * registered component instead of the generic form fallback.
 */

import type { ComponentType } from 'react';

interface PluginSettingsProps {
    /** Current settings values for this plugin */
    settings: Record<string, unknown>;
    /** Callback to update a single setting key */
    onUpdate: (key: string, value: unknown) => void;
    /** All settings as a flat object for bulk operations */
    onUpdateAll: (settings: Record<string, unknown>) => void;
}

type PluginSettingsComponent = ComponentType<PluginSettingsProps>;

const registry = new Map<string, PluginSettingsComponent>();

/**
 * Register a settings component for a plugin.
 *
 * @param pluginName - The plugin's internal name (e.g. 'citation-tool')
 * @param component - React component that renders the settings form
 */
export function registerPluginSettingsForm(
    pluginName: string,
    component: PluginSettingsComponent,
): void {
    registry.set(pluginName, component);
}

/**
 * Get the registered settings component for a plugin, or undefined.
 */
export function getPluginSettingsForm(
    pluginName: string,
): PluginSettingsComponent | undefined {
    return registry.get(pluginName);
}

export type { PluginSettingsProps };
