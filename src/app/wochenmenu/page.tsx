import WochenmenuClient from './ClientPage';
import { getRawWeeklyMenu } from '@/lib/menuFetcher';

export const revalidate = 3600; // Cache for 1 hour

export default async function WochenmenuPage() {
  const weeklyMenu = await getRawWeeklyMenu();
  return <WochenmenuClient weeklyMenu={weeklyMenu} />;
}