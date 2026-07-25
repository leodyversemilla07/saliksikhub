<?php

use App\Core\Plugin\Hook;

beforeEach(function () {
    // Reset hooks between tests
    $reflection = new ReflectionClass(Hook::class);
    $actions = $reflection->getProperty('actions');
    $actions->setAccessible(true);
    $actions->setValue([]);

    $filters = $reflection->getProperty('filters');
    $filters->setAccessible(true);
    $filters->setValue([]);
});

it('can add and execute an action', function () {
    $executed = false;

    Hook::addAction('test.action', function () use (&$executed) {
        $executed = true;
    });

    expect($executed)->toBeFalse();

    Hook::doAction('test.action');

    expect($executed)->toBeTrue();
});

it('can pass parameters to an action', function () {
    $captured = null;

    Hook::addAction('test.action.with.params', function ($param) use (&$captured) {
        $captured = $param;
    });

    Hook::doAction('test.action.with.params', 'hello');

    expect($captured)->toBe('hello');
});

it('can execute multiple actions on the same hook', function () {
    $results = [];

    Hook::addAction('test.multi', function () use (&$results) {
        $results[] = 'first';
    });
    Hook::addAction('test.multi', function () use (&$results) {
        $results[] = 'second';
    });

    Hook::doAction('test.multi');

    expect($results)->toBe(['first', 'second']);
});

it('can add and apply a filter', function () {
    Hook::addFilter('test.filter', function ($value) {
        return strtoupper($value);
    });

    $result = Hook::applyFilters('test.filter', 'hello');

    expect($result)->toBe('HELLO');
});

it('can chain multiple filters', function () {
    Hook::addFilter('test.chain', function ($value) {
        return $value.' world';
    });
    Hook::addFilter('test.chain', function ($value) {
        return strtoupper($value);
    });

    $result = Hook::applyFilters('test.chain', 'hello');

    expect($result)->toBe('HELLO WORLD');
});

it('returns original value when no filters are registered', function () {
    $result = Hook::applyFilters('nonexistent.filter', 'original');

    expect($result)->toBe('original');
});

it('respects filter priority', function () {
    $results = [];

    Hook::addFilter('test.priority', function ($value) use (&$results) {
        $results[] = 'low';

        return $value;
    }, 20);

    Hook::addFilter('test.priority', function ($value) use (&$results) {
        $results[] = 'high';

        return $value;
    }, 10);

    Hook::applyFilters('test.priority', 'value');

    // Higher priority (lower number) runs first
    expect($results)->toBe(['high', 'low']);
});

it('passes additional parameters to filters', function () {
    Hook::addFilter('test.params', function ($value, $prefix, $suffix) {
        return $prefix.$value.$suffix;
    }, 10, 3);

    $result = Hook::applyFilters('test.params', 'middle', 'before', 'after');

    expect($result)->toBe('beforemiddleafter');
});

it('does not execute actions for non-matching hooks', function () {
    $executed = false;

    Hook::addAction('test.other', function () use (&$executed) {
        $executed = true;
    });

    Hook::doAction('test.unrelated');

    expect($executed)->toBeFalse();
});

it('returns null when no filters applied', function () {
    $result = Hook::applyFilters('nonexistent', null);

    expect($result)->toBeNull();
});

it('can remove a registered action', function () {
    $executed = false;

    $callback = function () use (&$executed) {
        $executed = true;
    };

    Hook::addAction('test.removable', $callback);
    Hook::removeAction('test.removable', $callback);

    Hook::doAction('test.removable');

    expect($executed)->toBeFalse();
});

it('can remove a registered filter', function () {
    Hook::addFilter('test.removable', function ($value) {
        return 'modified';
    });

    // Remove all filters for this hook
    $reflection = new ReflectionClass(Hook::class);
    $filters = $reflection->getProperty('filters');
    $filters->setAccessible(true);
    $filters->setValue([]);

    $result = Hook::applyFilters('test.removable', 'original');

    expect($result)->toBe('original');
});
