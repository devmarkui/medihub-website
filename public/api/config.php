<?php
/**
 * MEDIHUB lightweight JSON backend — shared-hosting friendly (PHP 7.0+).
 *
 * No database required. Announcement + appointments are stored as JSON files
 * in /api/data (protected from direct web access). Admin write/read actions
 * require a token obtained from login.php.
 */
declare(strict_types=1);

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN PASSWORD  — CHANGE THIS to a strong, private value before going live.
//  This is the password you type on the /admin/login screen.
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_SECRET = 'medihub2024';

// How long an admin login stays valid (seconds). 30 days by default.
const TOKEN_TTL = 60 * 60 * 24 * 30;

// ── Data storage ─────────────────────────────────────────────────────────────
function data_dir(): string {
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    // Block direct web access to the JSON data files.
    $guard = $dir . '/.htaccess';
    if (!file_exists($guard)) {
        @file_put_contents($guard, "Require all denied\nDeny from all\n");
    }
    return $dir;
}

function read_json(string $name, $fallback) {
    $file = data_dir() . '/' . $name;
    if (!file_exists($file)) return $fallback;
    $raw = @file_get_contents($file);
    if ($raw === false || $raw === '') return $fallback;
    $data = json_decode($raw, true);
    return $data === null ? $fallback : $data;
}

function write_json(string $name, $value): bool {
    $file = data_dir() . '/' . $name;
    $fp = @fopen($file, 'c+');
    if (!$fp) return false;
    if (!flock($fp, LOCK_EX)) { fclose($fp); return false; }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode(
        $value,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
    ));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return true;
}

// ── Responses ────────────────────────────────────────────────────────────────
function send_json($data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_body(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// ── Token auth ───────────────────────────────────────────────────────────────
/** Returns a new token, or null if it couldn't be persisted (data dir not
 *  writable — in which case login must fail rather than hand out a token the
 *  server can't recognise). */
function create_token(): ?string {
    $token = bin2hex(random_bytes(32));
    $tokens = read_json('tokens.json', []);
    $now = time();
    // Drop expired tokens while we're here.
    foreach ($tokens as $t => $exp) {
        if ($exp < $now) unset($tokens[$t]);
    }
    $tokens[$token] = $now + TOKEN_TTL;
    return write_json('tokens.json', $tokens) ? $token : null;
}

function token_is_valid(string $token): bool {
    if ($token === '') return false;
    $tokens = read_json('tokens.json', []);
    if (!isset($tokens[$token])) return false;
    return (int) $tokens[$token] >= time();
}

function require_admin(): void {
    $token = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
    if (!is_string($token) || !token_is_valid($token)) {
        send_json(['error' => 'Unauthorized'], 401);
    }
}

// ── CORS / preflight ─────────────────────────────────────────────────────────
// Production: site and API share the same origin, so this is permissive but
// harmless. Adjust the origin if you ever serve the API from another domain.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}
