import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from '@/lib/auth';
import SupplierSidebar from '@/components/dashboard/SupplierSidebar';
import SupplierRfqManager from '@/components/dashboard/SupplierRfqManager';
import SupplierContractManager from '@/components/dashboard/SupplierContractManager';
import UserNav from '@/components/UserNav';
import { Bell, Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupplierDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
   
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = await decrypt(sessionCookie);

    if (!session || !session.id) {
        redirect('/login');
    }

    // Ensure the user is a supplier or admin
    if (session.role !== 'supplier' && session.role !== 'admin') {
        redirect('/');
    }

    const resolvedParams = await searchParams;
    const view = resolvedParams?.view || 'overview';

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800">
            {/* Sidebar Kiri */}
            <SupplierSidebar />

            {/* Konten Utama */}
            <main className="flex-1 ml-64 p-8">
                {/* Header Atas */}
                <header className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8 sticky top-6 z-40">
                    <div className="flex items-center bg-gray-50 px-4 py-2.5 rounded-xl w-96 border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500 transition">
                        <Search size={18} className="text-gray-400 mr-3" />
                        <input type="text" placeholder="Cari RFQ, Kontrak..." className="bg-transparent border-none outline-none text-sm w-full" />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-emerald-500 transition bg-gray-50 rounded-full">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <UserNav />
                    </div>
                </header>

                {/* Konten Dinamis Berdasarkan Tab (view) */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {view === 'overview' && (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Supplier Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SupplierRfqManager userId={session.id as string} />
                                <SupplierContractManager userId={session.id as string} />
                            </div>
                        </div>
                    )}

                    {view === 'rfq' && <SupplierRfqManager userId={session.id as string} />}
                    {view === 'contracts' && <SupplierContractManager userId={session.id as string} />}
                </div>
            </main>
        </div>
    );
}
