import {getWidgetRenderer, type Widget} from '@/components/sidebar/widget-registry';

interface SidebarProps {
    /** Widgets to render in the sidebar, in order */
    widgets: Widget[];
    /** CSS class override for the sidebar container */
    className?: string;
}

/**
 * Reusable sidebar component.
 *
 * Renders registered widgets in order. Each widget is looked up
 * in the widget registry — if no renderer is found, it's silently
 * skipped (allowing graceful fallback if a plugin is disabled).
 *
 * Usage:
 * ```tsx
 * <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
 *   <div>{/* main content */}</div>
 *   <Sidebar widgets={sidebarWidgets} />
 * </div>
 * ```
 */
export function Sidebar({widgets, className}: SidebarProps) {
    if (!widgets || widgets.length === 0) {
        return null;
    }

    return (
        <aside
            className={`space-y-6 ${className ?? ''}`}
            aria-label="Sidebar"
        >
            {widgets
                .sort((a, b) => a.order - b.order)
                .map((widget) => (
                    <WidgetRenderer key={widget.id} widget={widget} />
                ))}
        </aside>
    );
}

/**
 * Internal helper that renders a single widget by looking up its renderer.
 */
function WidgetRenderer({widget}: {widget: Widget}) {
    const Renderer = getWidgetRenderer(widget.type);

    if (!Renderer) {
        // Unknown widget type — skip gracefully
        return null;
    }

    return <Renderer widget={widget} />;
}
