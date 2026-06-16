'use client';

import { useState, useEffect } from 'react';
import { getRfqs, updateRfqStatus } from '@/core/actions/rfq.action';
import { getProducts } from '@/core/actions/product.action';
import { FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RFQManager() {
    const [rfqs, setRfqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRfqs = async () => {
        setLoading(true);
        const data = await getRfqs();
        setRfqs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchRfqs();
    }, []);

    const handleUpdateStatus = async (id: number, status: 'accepted' | 'rejected') => {
        const res = await updateRfqStatus(id, status as any);
        if (res.success) {
            toast.success(`RFQ berhasil di-${status}`);
            fetchRfqs();
        } else {
            toast.error(res.error || 'Gagal mengubah status');
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText /> Manajemen RFQ (Request For Quotation)
                </h3>
                <p className="text-gray-500 text-sm mt-1">Kelola permintaan penawaran harga dari supplier B2B.</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr className="text-gray-500 text-xs uppercase tracking-wider font-bold">
                            <th className="p-4 pl-6">Tanggal</th>
                            <th className="p-4">Pembeli (Supplier)</th>
                            <th className="p-4">Produk</th>
                            <th className="p-4 text-right">Target Harga</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center pr-6">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {rfqs.map((r) => (
                            <tr key={r.id} className="hover:bg-emerald-50/30 transition group">
                                <td className="p-4 pl-6 text-slate-600">
                                    {new Date(r.created_at).toLocaleDateString('id-ID')}
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-slate-900">{r.user?.company_name || r.user?.name}</p>
                                    <p className="text-xs text-gray-500">{r.user?.email}</p>
                                </td>
                                <td className="p-4">
                                    <p className="font-medium text-slate-800">{r.product?.name}</p>
                                    <p className="text-xs text-gray-500">{r.quantity_ton} Ton - Grade: {r.grade_requested}</p>
                                </td>
                                <td className="p-4 text-right font-mono text-slate-800 text-sm">
                                    {r.notes || '-'}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        r.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 
                                        r.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                        r.status === 'quoted' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {r.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-center pr-6">
                                    {r.status === 'pending' ? (
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleUpdateStatus(r.id, 'accepted')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Accept">
                                                <CheckCircle size={20} />
                                            </button>
                                            <button onClick={() => handleUpdateStatus(r.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Reject">
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-xs">Selesai</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && rfqs.length === 0 && <div className="text-center py-10 text-gray-400">Belum ada RFQ</div>}
            </div>
        </div>
    );
}
