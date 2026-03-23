import AdminDashboard from './ClientPage';
import { getDynamicMenu } from '@/lib/menuFetcher';
import { cookies } from 'next/headers';

export default async function Page({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = await params;
    const menuData = await getDynamicMenu();

    // Set the admin API key as a secure httpOnly cookie.
    // The browser sends cookies automatically with every fetch request,
    // so the client component does NOT need to know the key at all.
    const cookieStore = await cookies();
    const adminKey = process.env.ADMIN_API_KEY || '';
    if (adminKey) {
        cookieStore.set('admin_api_key', adminKey, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api',
            maxAge: 60 * 60 * 24, // 24 hours
        });
    }

    return <AdminDashboard storeId={storeId} menuData={menuData} />;
}
