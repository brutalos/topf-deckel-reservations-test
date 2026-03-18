import AdminDashboard from './ClientPage';
import { getDynamicMenu } from '@/lib/menuFetcher';

export default async function Page({ params }: { params: Promise<{ storeId: string }> }) {
    const menuData = await getDynamicMenu();
    return <AdminDashboard params={params} menuData={menuData} />;
}
