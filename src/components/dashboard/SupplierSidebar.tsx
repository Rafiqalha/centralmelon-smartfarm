'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Package, FileText, ShoppingBasket, LogOut, Sprout, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { clearSession } from '@/core/actions/session.action';

export default function SupplierSidebar() {
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'overview';
    const router = useRouter();

    const handleLogout = async () => {
        await clearSession();
        router.push('/login');
    };

    const menuItems = [
        { name: 'Dashboard', icon: Package, id: 'overview' },
        { name: 'Request For Quotation', icon: FileText, id: 'rfq' },   
        { name: 'Kontrak Suplai', icon: ShoppingBasket, id: 'contracts' },
    ];

    return (
        <aside className="w-64 bg-[#0f172a] text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50 overflow-y-auto">
            {/* 1. BRANDING AREA */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Sprout size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Central Melon</h1>
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Supplier Portal</p>
                    </div>
                </div>
            </div>

            {/* 2. MENU NAVIGATION */}
            <nav className="flex-1 px-4 mt-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = view === item.id;
                    return (
                        <Link
                            key={item.id}
                            href={`/supplier?view=${item.id}`}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${isActive
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 translate-x-1'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* 3. FOOTER ACTIONS (WEBSITE & LOGOUT) */}
            <div className="p-4 border-t border-white/10 mt-auto space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition font-medium"
                >
                    <Globe size={20} />
                    Katalog Grosir
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-xl transition font-medium"
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </aside>
    );
}
