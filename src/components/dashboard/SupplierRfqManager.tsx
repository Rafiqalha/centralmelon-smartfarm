'use client';

import { useState, useEffect } from 'react';
import { getMyRfqs } from '@/core/actions/rfq.action';
import { FileText, CheckCircle, Clock, XCircle, FileWarning } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SupplierRfqManager({ userId }: { userId: string }) {
    const [rfqs, setRfqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRfqs = async () => {
        setLoading(true);
        const data = await getMyRfqs(userId);
        setRfqs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchRfqs();
    }, [userId]);

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText /> Request For Quotation Saya
                </h3>
                <p className="text-gray-500 text-sm mt-1">Lacak status pengajuan RFQ Anda ke Central Melon.</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr className="text-gray-500 text-xs uppercase tracking-wider font-bold">
                            <th className="p-4 pl-6">ID RFQ</th>
                            <th className="p-4">Produk yang Diminta</th>
                            <th className="p-4 text-center">Volume (Ton)</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right pr-6">Tanggal Pengajuan</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {rfqs.map((r) => (
                            <tr key={r.id} className="hover:bg-emerald-50/30 transition group">
                                <td className="p-4 pl-6 font-mono font-bold text-emerald-700">
                                    RFQ-{String(r.id).padStart(4, '0')}
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-slate-900">{r.product?.name || 'Unknown Product'}</p>
                                    <p className="text-xs text-gray-500">Grade {r.grade_requested}</p>
                                </td>
                                <td className="p-4 text-center font-medium text-slate-800">
                                    {r.quantity_ton} Ton
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 justify-center w-fit mx-auto ${
                                        r.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                        r.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 
                                        r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {r.status === 'pending' ? <Clock size={12} /> : 
                                         r.status === 'accepted' ? <CheckCircle size={12} /> : 
                                         r.status === 'rejected' ? <XCircle size={12} /> : <FileWarning size={12} />}
                                        {r.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-right pr-6 text-gray-500">
                                    {new Date(r.created_at).toLocaleDateString('id-ID')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && rfqs.length === 0 && <div className="text-center py-10 text-gray-400">Belum ada pengajuan RFQ</div>}
            </div>
        </div>
    );
}
