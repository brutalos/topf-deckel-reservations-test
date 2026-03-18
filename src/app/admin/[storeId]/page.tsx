import AdminDashboard from './ClientPage';
import { getDynamicMenu } from '@/lib/menuFetcher';

export default async function Page({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = await params;
    const menuData = await getDynamicMenu();
    return <AdminDashboard storeId={storeId} menuData={menuData} />;
}
