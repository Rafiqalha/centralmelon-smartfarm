'use client';

import { useState, useEffect } from 'react';
import { getContracts, updateContractStatus } from '@/core/actions/contract.action';
import { ShoppingBasket, CheckCircle, Clock, Loader2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContractManager() {
    const [contracts, setContracts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchContracts = async () => {
        setLoading(true);
        const data = await getContracts();
        setContracts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    const handleUpdateStatus = async (id: number, status: 'active' | 'expired' | 'terminated') => {
        const res = await updateContractStatus(id, status as any);
        if (res.success) {
            toast.success(`Kontrak berhasil di-${status}`);
            fetchContracts();
        } else {
            toast.error(res.error || 'Gagal mengubah status');
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBasket /> Manajemen Kontrak Suplai
                </h3>
                <p className="text-gray-500 text-sm mt-1">Kelola kontrak suplai B2B yang sedang berjalan.</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr className="text-gray-500 text-xs uppercase tracking-wider font-bold">
                            <th className="p-4 pl-6">ID Kontrak</th>
                            <th className="p-4">Pembeli (Supplier)</th>
                            <th className="p-4">Produk & Jadwal</th>
                            <th className="p-4 text-right">Harga Disepakati</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center pr-6">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {contracts.map((c) => (
                            <tr key={c.id} className="hover:bg-emerald-50/30 transition group">
                                <td className="p-4 pl-6 font-mono font-bold text-emerald-700">
                                    CTR-{String(c.id).padStart(4, '0')}
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-slate-900">{c.user?.company_name || c.user?.name}</p>
                                    <p className="text-xs text-gray-500">{c.user?.email}</p>
                                </td>
                                <td className="p-4">
                                    <p className="font-medium text-slate-800">{c.product?.name} ({c.packaging})</p>
                                    <p className="text-xs text-gray-500">{c.volume_ton_month} Ton/Bln • {new Date(c.start_date).toLocaleDateString('id-ID')} - {new Date(c.end_date).toLocaleDateString('id-ID')}</p>
                                </td>
                                <td className="p-4 text-right font-mono text-slate-800 font-bold">
                                    Rp {Number(c.price_per_ton_locked).toLocaleString('id-ID')}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 justify-center w-fit mx-auto ${
                                        c.status === 'expired' ? 'bg-emerald-100 text-emerald-700' : 
                                        c.status === 'terminated' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {c.status === 'active' ? <Clock size={12} /> : null}
                                        {c.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-center pr-6">
                                    {c.status === 'active' ? (
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleUpdateStatus(c.id, 'expired')} className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg font-bold hover:bg-emerald-100 transition">
                                                Selesai
                                            </button>
                                            <button onClick={() => handleUpdateStatus(c.id, 'terminated')} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-lg font-bold hover:bg-red-100 transition">
                                                Terminasi
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-xs">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && contracts.length === 0 && <div className="text-center py-10 text-gray-400">Belum ada Kontrak</div>}
            </div>
        </div>
    );
}
