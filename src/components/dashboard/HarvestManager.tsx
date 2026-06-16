'use client';

import { useState, useEffect } from 'react';
import { getHarvests, addHarvest, updateActualHarvest } from '@/core/actions/harvest.action';
import { getProducts } from '@/core/actions/product.action';
import { Sprout, Save, Loader2, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HarvestManager() {
    const [harvests, setHarvests] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddMode, setIsAddMode] = useState(false);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);

    const [newHarvest, setNewHarvest] = useState({
        product_id: 0,
        period_label: 'Minggu 1, Jan 2026',
        forecast_ton: 0,
        forecast_date: '',
        harvest_date: '',
    });

    const [actualYield, setActualYield] = useState<number>(0);

    const fetchData = async () => {
        setLoading(true);
        const [hData, pData] = await Promise.all([getHarvests(), getProducts()]);
        setHarvests(hData);
        setProducts(pData);
        if (pData.length > 0 && newHarvest.product_id === 0) {
            setNewHarvest(prev => ({ ...prev, product_id: pData[0].id }));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddHarvest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await addHarvest({
            product_id: Number(newHarvest.product_id),
            period_label: newHarvest.period_label,
            forecast_ton: Number(newHarvest.forecast_ton),
            forecast_date: new Date(newHarvest.forecast_date),
            harvest_date: new Date(newHarvest.harvest_date),
        });

        if (res.success) {
            setIsAddMode(false);
            fetchData();
            toast.success("Proyeksi Panen Ditambahkan!");
            setNewHarvest({ ...newHarvest, forecast_ton: 0, forecast_date: '', harvest_date: '' });
        } else {
            toast.error("Gagal: " + res.error);
        }
        setLoading(false);
    };

    const handleConfirmHarvest = async (id: number) => {
        if (!actualYield || actualYield <= 0) {
            toast.error("Masukkan angka realisasi panen yang valid.");
            return;
        }

        const res = await updateActualHarvest(id, Number(actualYield));
        if (res.success) {
            toast.success(`Panen berhasil dikonfirmasi!`);
            setIsUpdating(null);
            fetchData();
        } else {
            toast.error(res.error || 'Gagal menyimpan data realisasi');
        }
    };

    const inputClass = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-800";

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Sprout /> Proyeksi & Realisasi Panen
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">Estimasi kuantitas panen untuk memastikan pasokan kontrak terpenuhi.</p>
                </div>
                <button
                    onClick={() => setIsAddMode(!isAddMode)}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg shadow-slate-200"
                >
                    {isAddMode ? 'Batal' : '+ Tambah Proyeksi Panen'}
                </button>
            </div>

            {/* FORM INPUT B2B */}
            {isAddMode && (
                <form onSubmit={handleAddHarvest} className="mb-10 p-8 bg-emerald-50/50 rounded-3xl border border-emerald-100 animate-in slide-in-from-top-4">
                    <h4 className="font-bold text-emerald-900 mb-6 text-lg">Input Proyeksi Panen Baru</h4>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Produk Varietas</label>
                            <select required className={inputClass} value={newHarvest.product_id} onChange={e => setNewHarvest({ ...newHarvest, product_id: Number(e.target.value) })}>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} - Grade {p.grade}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Label Periode</label>
                            <input required placeholder="Minggu 1, Jan 2026" className={inputClass} value={newHarvest.period_label} onChange={e => setNewHarvest({ ...newHarvest, period_label: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Est. Panen (Ton)</label>
                            <input required type="number" step="0.1" placeholder="0.0" className={inputClass} value={newHarvest.forecast_ton || ''} onChange={e => setNewHarvest({ ...newHarvest, forecast_ton: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tgl Forecast</label>
                            <input required type="date" className={inputClass} value={newHarvest.forecast_date} onChange={e => setNewHarvest({ ...newHarvest, forecast_date: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tgl Panen</label>
                            <input required type="date" className={inputClass} value={newHarvest.harvest_date} onChange={e => setNewHarvest({ ...newHarvest, harvest_date: e.target.value })} />
                        </div>
                    </div>

                    <button disabled={loading} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-70">
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        Simpan Proyeksi
                    </button>
                </form>
            )}

            {/* TABEL KATALOG */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr className="text-gray-500 text-xs uppercase tracking-wider font-bold">
                            <th className="p-4 pl-6">Tanggal Panen</th>
                            <th className="p-4">Produk & Periode</th>
                            <th className="p-4 text-right">Est. Yield</th>
                            <th className="p-4 text-right">Actual Yield</th>
                            <th className="p-4 text-center">Status / Akurasi</th>
                            <th className="p-4 text-center pr-6">Realisasi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {harvests.map((h) => {
                            const isHarvested = h.actual_ton !== null;
                            return (
                                <tr key={h.id} className="hover:bg-emerald-50/30 transition group">
                                    <td className="p-4 pl-6 font-medium text-slate-800">
                                        {new Date(h.harvest_date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-slate-900">{h.product?.name} (Grade {h.product?.grade})</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">📅 {h.period_label}</p>
                                    </td>
                                    <td className="p-4 text-right font-mono text-slate-600">
                                        {h.forecast_ton} Ton
                                    </td>
                                    <td className="p-4 text-right font-mono text-slate-800 font-bold">
                                        {isHarvested ? `${h.actual_ton} Ton` : '-'}
                                    </td>
                                    <td className="p-4 text-center">
                                        {isHarvested ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Selesai</span>
                                                <span className="text-xs font-bold text-slate-500">{Number(h.accuracy_pct).toFixed(1)}% Akurat</span>
                                            </div>
                                        ) : (
                                            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold uppercase">Menunggu</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center pr-6">
                                        {!isHarvested ? (
                                            isUpdating === h.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="number" 
                                                        step="0.1"
                                                        autoFocus
                                                        className="w-20 p-1.5 border border-gray-300 rounded text-center text-sm" 
                                                        placeholder="Ton"
                                                        onChange={(e) => setActualYield(Number(e.target.value))}
                                                    />
                                                    <button onClick={() => handleConfirmHarvest(h.id)} className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition">
                                                        <CheckSquare size={16} />
                                                    </button>
                                                    <button onClick={() => setIsUpdating(null)} className="p-1.5 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition text-xs font-bold">
                                                        X
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setIsUpdating(h.id)} className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-slate-800 transition shadow-sm">
                                                    Input Realisasi
                                                </button>
                                            )
                                        ) : (
                                            <span className="text-gray-400 text-xs">-</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {!loading && harvests.length === 0 && <div className="text-center py-10 text-gray-400">Belum ada Proyeksi Panen</div>}
            </div>
        </div>
    );
}
