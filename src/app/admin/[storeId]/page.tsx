import AdminDashboard from './ClientPage';
import { getDynamicMenu } from '@/lib/menuFetcher';
import { cookies } from 'next/headers';

export default async function Page({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = await params;
    const menuData = await getDynamicMenu();

    // Pass the admin API key directly to the client component.
    const adminKey = process.env.ADMIN_API_KEY || '';

    return <AdminDashboard storeId={storeId} menuData={menuData} adminKey={adminKey} />;
}
