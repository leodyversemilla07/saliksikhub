<?php

namespace App\Core\Plugin;

class Hook
{
    /**
     * Registered actions.
     *
     * @var array<string, array<int, array{priority: int, callback: callable}>>
     */
    protected static array $actions = [];

    /**
     * Registered filters.
     *
     * @var array<string, array<int, array{priority: int, callback: callable}>>
     */
    protected static array $filters = [];

    /**
     * Add an action hook.
     *
     * @param string $hook The action name
     * @param callable $callback The callback function
     * @param int $priority Priority (lower = earlier execution)
     */
    public static function addAction(string $hook, callable $callback, int $priority = 10): void
    {
        self::$actions[$hook][] = [
            'priority' => $priority,
            'callback' => $callback,
        ];

        // Sort by priority
        usort(self::$actions[$hook], function ($a, $b) {
            return $a['priority'] <=> $b['priority'];
        });
    }

    /**
     * Execute all callbacks for an action.
     *
     * @param string $hook The action name
     * @param mixed ...$args Arguments to pass to callbacks
     */
    public static function doAction(string $hook, ...$args): void
    {
        if (!isset(self::$actions[$hook])) {
            return;
        }

        foreach (self::$actions[$hook] as $action) {
            call_user_func_array($action['callback'], $args);
        }
    }

    /**
     * Add a filter hook.
     *
     * @param string $hook The filter name
     * @param callable $callback The callback function
     * @param int $priority Priority (lower = earlier execution)
     */
    public static function addFilter(string $hook, callable $callback, int $priority = 10): void
    {
        self::$filters[$hook][] = [
            'priority' => $priority,
            'callback' => $callback,
        ];

        // Sort by priority
        usort(self::$filters[$hook], function ($a, $b) {
            return $a['priority'] <=> $b['priority'];
        });
    }

    /**
     * Apply all filters to a value.
     *
     * @param string $hook The filter name
     * @param mixed $value The value to filter
     * @param mixed ...$args Additional arguments
     * @return mixed The filtered value
     */
    public static function applyFilters(string $hook, mixed $value, ...$args): mixed
    {
        if (!isset(self::$filters[$hook])) {
            return $value;
        }

        foreach (self::$filters[$hook] as $filter) {
            $value = call_user_func_array($filter['callback'], array_merge([$value], $args));
        }

        return $value;
    }

    /**
     * Remove an action.
     *
     * @param string $hook The action name
     * @param callable $callback The callback to remove
     */
    public static function removeAction(string $hook, callable $callback): void
    {
        if (!isset(self::$actions[$hook])) {
            return;
        }

        self::$actions[$hook] = array_filter(
            self::$actions[$hook],
            fn ($action) => $action['callback'] !== $callback
        );
    }

    /**
     * Remove a filter.
     *
     * @param string $hook The filter name
     * @param callable $callback The callback to remove
     */
    public static function removeFilter(string $hook, callable $callback): void
    {
        if (!isset(self::$filters[$hook])) {
            return;
        }

        self::$filters[$hook] = array_filter(
            self::$filters[$hook],
            fn ($filter) => $filter['callback'] !== $callback
        );
    }

    /**
     * Check if an action exists.
     */
    public static function hasAction(string $hook): bool
    {
        return isset(self::$actions[$hook]) && count(self::$actions[$hook]) > 0;
    }

    /**
     * Check if a filter exists.
     */
    public static function hasFilter(string $hook): bool
    {
        return isset(self::$filters[$hook]) && count(self::$filters[$hook]) > 0;
    }

    /**
     * Clear all hooks (useful for testing).
     */
    public static function clearAll(): void
    {
        self::$actions = [];
        self::$filters = [];
    }
}
