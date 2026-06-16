'use client';

import { useState, useEffect } from 'react';
import {
    Filter, Grid, List, Download, ChevronDown, CheckCircle,
    TrendingUp, Calendar, Package, ArrowRight, Activity, Droplets, ShoppingCart
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProducts } from '@/core/actions/product.action';

type Product = {
    id: number;
    name: string;
    variety_type: string;
    price_per_ton: string;
    supply_cap_ton_week: string;
    grade: string;
    image_url: string | null;
    avg_brix_min: number;      
    avg_brix_max: number;      
    moq_kg: number;        
    status: string;
};

export default function EnterpriseCatalog() {
    const router = useRouter();
    const { addToCart } = useCart();

    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            const data = await getProducts();
            setProducts(data as unknown as Product[]);
            setLoading(false);
        };

        fetchData();
    }, []);

    const filteredProducts = products.filter(p => {
        return (filterCategory === 'All' || p.variety_type === filterCategory);
    });

    const handleRequestQuote = (product: Product) => {
        if (product.status !== 'available') return;
        addToCart(product);
        router.push('/checkout');
    };

    const getHarvestDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 3); // Panen 3 hari lagi
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    return (
        <section className="bg-[#f8f9fa] min-h-screen font-sans text-slate-800">
            <div className="bg-white border-b border-gray-200 pt-32 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                        <div>
                            <span className="text-emerald-700 font-bold tracking-widest text-xs uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                Enterprise Procurement Portal
                            </span>
                            <h1 className="text-4xl font-bold mt-4 text-slate-900">Katalog Melon Premium</h1>
                            <p className="text-slate-500 mt-2 max-w-2xl text-lg">
                                Suplai langsung dari Smart Greenhouse dengan standar kualitas ekspor. Data real-time untuk keputusan pengadaan yang presisi.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-6 md:mt-0">
                            <button className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg text-sm flex items-center gap-2 hover:bg-slate-800 transition">
                                <Download size={16} /> Download Price List (PDF)
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Varietas', value: `${products.length} Jenis`, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Stok Siap Kirim', value: `${products.reduce((acc, curr) => acc + (curr.status === 'available' ? Number(curr.supply_cap_ton_week) : 0), 0)} Ton`, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Forecast Mingguan', value: '+20 Ton', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                            { label: 'Konsistensi Brix', value: '94% Stabil', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">{stat.label}</p>
                                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="sticky top-20 z-30 bg-[#f8f9fa]/95 backdrop-blur border-b border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 items-center">
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                        {['All', 'Net Melon', 'Smooth Skin', 'Exotic'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border ${filterCategory === cat
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-white text-slate-600 border-gray-200 hover:border-slate-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-md transition ${viewMode === 'table' ? 'bg-slate-100 text-slate-900' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="text-center py-20 text-gray-400 animate-pulse">Memuat data greenhouse...</div>
                ) : viewMode === 'grid' ? (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(p => (
                            <div key={p.id} className={`group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col ${p.status !== 'available' ? 'opacity-75 grayscale' : ''}`}>
                                <div className="relative h-64 bg-gray-100 overflow-hidden flex items-center justify-center">
                                    {p.image_url ? (
                                        <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition duration-700" />
                                    ) : (
                                        <div className="text-gray-300">No Image</div>
                                    )}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1 rounded-md shadow-sm border border-gray-100">
                                            {p.grade} Premium
                                        </span>
                                        {p.status === 'available' ? (
                                            <span className={`text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm bg-emerald-500`}>
                                                Ready Stock
                                            </span>
                                        ) : (
                                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                                                Sold Out
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{p.variety_type}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm border-t border-b border-gray-100 py-4 mb-6">
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase font-bold">Avg Brix</p>
                                            <p className="font-semibold text-slate-800 flex items-center gap-1">
                                                <Droplets size={12} className="text-emerald-500" /> {p.avg_brix_min}-{p.avg_brix_max}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase font-bold">Suplai Max</p>
                                            <p className={`font-bold text-slate-800`}>{p.supply_cap_ton_week} Ton/Minggu</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase font-bold">MOQ</p>
                                            <p className="font-semibold text-slate-800">{p.moq_kg} Kg</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase font-bold">Harvest ETA</p>
                                            <p className="font-semibold text-orange-600">{getHarvestDate()}</p>
                                        </div>
                                    </div>

                                    {/* Pricing & CTA */}
                                    <div className="mt-auto flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400">Harga / Ton</p>
                                            <p className="text-lg font-bold text-slate-900">Rp {Number(p.price_per_ton).toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRequestQuote(p)}
                                            disabled={p.status !== 'available'}
                                            className={`px-5 py-2.5 text-white font-bold rounded-lg transition shadow-lg flex items-center gap-2 ${p.status === 'available'
                                                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
                                                    : 'bg-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {p.status === 'available' ? <><ShoppingCart size={16} /> + Keranjang</> : 'Habis'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                ) : (
                    
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-200">
                                <tr>
                                    <th className="p-4">Varietas</th>
                                    <th className="p-4">Grade</th>
                                    <th className="p-4">Brix</th>
                                    <th className="p-4">Suplai Max</th>
                                    <th className="p-4">Harga / Ton</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden relative">
                                                {p.image_url && <Image src={p.image_url} alt="" fill className="object-cover" />}
                                            </div>
                                            {p.name}
                                        </td>
                                        <td className="p-4"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">{p.grade}</span></td>
                                        <td className="p-4 text-slate-600">{p.avg_brix_min}-{p.avg_brix_max}</td>
                                        <td className={`p-4 font-bold text-slate-600`}>{p.supply_cap_ton_week} Ton/Minggu</td>
                                        <td className="p-4 font-mono">Rp {Number(p.price_per_ton).toLocaleString()}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleRequestQuote(p)}
                                                disabled={p.status !== 'available'}
                                                className={`font-bold hover:underline ${p.status === 'available' ? 'text-emerald-600' : 'text-gray-400'}`}
                                            >
                                                {p.status === 'available' ? 'Add to Cart' : 'Sold Out'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </section>
    );
}