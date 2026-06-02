<?php
/**
 * Appointments store.
 *   POST ?action=create   → public: add a new booking (no auth)
 *   GET                    → admin: list all bookings (token required)
 *   POST ?action=update    → admin: replace/merge a booking by id (token)
 *   POST ?action=delete    → admin: remove a booking by id (token)
 */
require __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';

// ── Public: create a booking ─────────────────────────────────────────────────
if ($method === 'POST' && $action === 'create') {
    $body = read_body();
    if (empty($body['id']) || empty($body['name']) || empty($body['phone'])) {
        send_json(['error' => 'Missing required fields'], 422);
    }
    $list = read_json('appointments.json', []);
    array_unshift($list, $body);
    // Guard against unbounded growth on a shared host.
    if (count($list) > 2000) {
        $list = array_slice($list, 0, 2000);
    }
    write_json('appointments.json', $list);
    send_json(['ok' => true, 'id' => $body['id']]);
}

// ── Everything below is admin-only ───────────────────────────────────────────
require_admin();

if ($method === 'GET') {
    send_json(read_json('appointments.json', []));
}

if ($method === 'POST' && $action === 'update') {
    $body = read_body();
    $id    = (string) ($body['id'] ?? '');
    $patch = $body['patch'] ?? [];
    if ($id === '' || !is_array($patch)) {
        send_json(['error' => 'Missing id or patch'], 422);
    }
    $list = read_json('appointments.json', []);
    foreach ($list as &$a) {
        if (($a['id'] ?? '') === $id) {
            // String keys in $patch overwrite existing ones (full or partial).
            $a = array_merge($a, $patch);
            break;
        }
    }
    unset($a);
    write_json('appointments.json', $list);
    send_json(['ok' => true]);
}

if ($method === 'POST' && $action === 'delete') {
    $body = read_body();
    $id = (string) ($body['id'] ?? '');
    $list = read_json('appointments.json', []);
    $list = array_values(array_filter($list, static function ($a) use ($id) {
        return ($a['id'] ?? '') !== $id;
    }));
    write_json('appointments.json', $list);
    send_json(['ok' => true]);
}

send_json(['error' => 'Method not allowed'], 405);
