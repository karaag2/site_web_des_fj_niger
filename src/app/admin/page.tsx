import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getAdminDashboardData, getAdminUser } from '@/services/admin.service';

export const metadata = {
  title: 'Administration — Les Fabricants de Joie',
};

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/login');
  }

  const user = await getAdminUser(session.user.id);

  if (!user || !['superadmin', 'admin'].includes(user.role)) {
    redirect('/login');
  }

  // Fetch dashboard data through the unified service layer
  const data = await getAdminDashboardData();

  return (
    <AdminDashboard
      user={{ name: user.name, email: user.email, role: user.role }}
      stats={{
        totalPosts: data.posts,
        publishedPosts: data.publishedCount,
        draftPosts: data.draftCount,
        totalViews: data.totalViews,
      }}
      categories={data.categories}
      recentPosts={data.recentPosts}
    />
  );
}
