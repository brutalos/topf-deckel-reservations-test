/**
 * Admin authentication helper.
 * Checks for the ADMIN_API_KEY via:
 *  1. Authorization: Bearer <key> header  (for external API calls / curl)
 *  2. admin_api_key cookie                (for browser dashboard — set by page.tsx)
 */
export function isAdminAuthorized(req: Request): boolean {
    const expectedKey = process.env.ADMIN_API_KEY;
    if (!expectedKey) return false;

    // 1. Check Authorization header
    const authHeader = req.headers.get('authorization');
    if (authHeader === `Bearer ${expectedKey}`) return true;

    // 2. Check cookie
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|;\s*)admin_api_key=([^;]*)/);
    if (match && match[1] === expectedKey) return true;

    return false;
}

export function getAuthDebugInfo(req: Request): string {
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie') || '';
    const hasCookie = cookieHeader.includes('admin_api_key=');
    return `Header: ${authHeader ? 'Present' : 'Missing'}, Cookie: ${hasCookie ? 'Present' : 'Missing'}`;
}
