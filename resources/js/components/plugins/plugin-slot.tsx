import {usePage} from '@inertiajs/react';
import {type ReactNode} from 'react';

/**
 * Plugin slot identifiers used by plugin components
 * to know where in the page they should render.
 */
export type PluginSlot =
    | 'announcement_banner'
    | 'homepage_before'
    | 'homepage_after'
    | 'header_after'
    | 'footer_before'
    | 'sidebar_top'
    | 'sidebar_bottom'
    | 'content_top'
    | 'content_bottom';

interface PluginComponent {
    /** Unique identifier for this plugin instance */
    key: string;
    /** The slot this component should render in */
    slot: PluginSlot;
    /** Component name registered globally */
    component: string;
    /** Props to pass to the component */
    props: Record<string, unknown>;
}

interface PluginData {
    components?: PluginComponent[];
    [key: string]: unknown;
}

interface PluginRendererProps {
    slot: PluginSlot;
    children?: ReactNode;
}

/**
 * Renders plugin-injected components for a given slot position.
 * Wraps children with plugin content injected by activated plugins.
 *
 * @example
 * ```tsx
 * <PluginSlot slot="announcement_banner" />
 * // or wrapping content:
 * <PluginSlot slot="content_top">
 *   <MyContent />
 * </PluginSlot>
 * ```
 */
export function PluginSlot({slot, children}: PluginRendererProps) {
    const {pluginData} = usePage<{pluginData?: PluginData}>().props;

    if (!pluginData?.components) {
        return children ?? null;
    }

    const matchedComponents = pluginData.components.filter(
        (c) => c.slot === slot,
    );

    if (matchedComponents.length === 0) {
        return children ?? null;
    }

    return (
        <>
            {matchedComponents.map((comp) => {
                const PluginComponent = getPluginComponent(comp.component);
                if (!PluginComponent) {
                    return null;
                }
                return (
                    <PluginComponent
                        key={comp.key}
                        {...(comp.props as Record<string, unknown>)}
                    />
                );
            })}
            {children}
        </>
    );
}

/**
 * Registry of available plugin components.
 * Core plugins register their components here.
 * Third-party plugins can register via window.__PLUGIN_COMPONENTS__ or a dynamic registry.
 */
const pluginComponentRegistry = new Map<
    string,
    React.ComponentType<Record<string, unknown>>
>();

/**
 * Register a plugin component so PluginSlot can render it.
 */
export function registerPluginComponent(
    name: string,
    component: React.ComponentType<Record<string, unknown>>,
): void {
    pluginComponentRegistry.set(name, component);
}

/**
 * Resolve a registered plugin component by name.
 */
function getPluginComponent(
    name: string,
): React.ComponentType<Record<string, unknown>> | null {
    return pluginComponentRegistry.get(name) ?? null;
}

export type {PluginData, PluginComponent};
