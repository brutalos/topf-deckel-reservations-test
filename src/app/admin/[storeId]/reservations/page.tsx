import AdminReservationsPage from './ClientPage';

export default async function Page({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = await params;
    const adminKey = process.env.ADMIN_API_KEY || '';

    return <AdminReservationsPage adminKey={adminKey} />;
}
