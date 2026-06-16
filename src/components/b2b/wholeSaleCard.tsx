'use client';

import { FileText, Truck, BarChart3, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface ProductB2B {
    id: number;
    name: string;
    grade: string;
    brix: string;
    moq: number;
    price_ton: number;
    capacity_week: number;
    lead_time: string;
    image_url: string;
    seasonality: string;
    variety_type?: string;
    status?: string;
}

export default function WholesaleCard({ product }: { product: ProductB2B }) {
    const { addToCart } = useCart();
    const router = useRouter();

    const handleRequestQuote = () => {
        // Format product object to match what CartContext expects
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price_ton,
            moq: `${product.moq} Kg`,
            image_url: product.image_url,
            category: product.variety_type || "Premium Melon",
            grade: product.grade,
        });
        router.push('/checkout');
    };
    return (
        <div className="bg-white border border-gray-200 rounded-xl hover:border-emerald-500 transition-all duration-300 hover:shadow-lg group flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-48 h-48 md:h-auto relative bg-gray-100 shrink-0">
                <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                    {product.seasonality}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
                            <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                <ShieldCheck size={12} /> Grade {product.grade} (Export Quality)
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-xs uppercase font-bold">Harga Estimasi / Ton</p>
                            <p className="text-lg font-mono font-bold text-slate-900">
                                Rp {(product.price_ton / 1000000).toFixed(1)} Jt
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4 text-sm">
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="text-slate-400 text-[10px] uppercase block">Avg Brix</span>
                            <span className="font-bold text-slate-700">{product.brix}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="text-slate-400 text-[10px] uppercase block">MOQ</span>
                            <span className="font-bold text-slate-700">{product.moq} Kg</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="text-slate-400 text-[10px] uppercase block">Supply Cap</span>
                            <span className="font-bold text-emerald-600">{product.capacity_week} Ton/Wk</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="text-slate-400 text-[10px] uppercase block">Lead Time</span>
                            <span className="font-bold text-slate-700">{product.lead_time}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-2 pt-4 border-t border-gray-100">
                    <button
                        onClick={handleRequestQuote}
                        disabled={product.capacity_week <= 0}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${
                            product.capacity_week > 0 
                            ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <FileText size={16} /> Request Quotation (RFQ)
                    </button>
                    <button className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition flex items-center gap-2">
                        <Truck size={16} /> Sample Batch
                    </button>
                    <Link href={`/products/${product.id}`} className="px-4 py-2.5 text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1">
                        Technical Detail <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}