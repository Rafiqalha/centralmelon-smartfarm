'use client';

import { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct } from '@/core/actions/product.action';
import { Plus, Trash2, Save, Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

type Product = {
    id: number;
    name: string;
    variety_type: string;
    grade: string;
    price_per_ton: string;
    avg_brix_min: number;
    avg_brix_max: number;
    moq_kg: number;
    supply_cap_ton_week: string;
    lead_time_days: number;
    status: string;
    image_url: string | null;
};

export default function InventoryManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddMode, setIsAddMode] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [newProduct, setNewProduct] = useState({
        name: '',
        variety_type: 'Net Melon',
        grade: 'A',
        price_per_ton: 0,
        avg_brix_min: 12,
        avg_brix_max: 14,
        moq_kg: 1000,
        supply_cap_ton_week: 5,
        lead_time_days: 3,
        status: 'available',
        image_url: ''
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fetchProductsData = async () => {
        setLoading(true);
        const data = await getProducts();
        setProducts(data as any);
        setLoading(false);
    };

    useEffect(() => {
        fetchProductsData();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            return data.url;
        } catch (error) {
            toast.error("Gagal upload gambar");
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let finalImageUrl = newProduct.image_url;
        if (selectedFile) {
            const url = await uploadImage(selectedFile);
            if (url) finalImageUrl = url;
        }

        const res = await addProduct({
            ...newProduct,
            grade: newProduct.grade as any,
            status: newProduct.status as any,
            image_url: finalImageUrl
        });

        if (res.success) {
            setIsAddMode(false);
            fetchProductsData();
            toast.success("Produk B2B Berhasil Ditambahkan!");

            setNewProduct({
                name: '', variety_type: 'Net Melon', grade: 'A', price_per_ton: 0,
                avg_brix_min: 12, avg_brix_max: 14, moq_kg: 1000, supply_cap_ton_week: 5,
                lead_time_days: 3, status: 'available', image_url: ''
            });
            setSelectedFile(null);
            setPreviewUrl(null);
        } else {
            toast.error("Gagal: " + res.error);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus produk ini dari katalog?")) return;
        setLoading(true);
        await deleteProduct(id);
        fetchProductsData();
        toast.success("Produk dihapus");
    };

    const inputClass = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-800";

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">Manajemen Katalog B2B</h3>
                    <p className="text-gray-500 text-sm mt-1">Atur spesifikasi teknis melon untuk RFQ.</p>
                </div>
                <button
                    onClick={() => setIsAddMode(!isAddMode)}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg shadow-slate-200"
                >
                    {isAddMode ? 'Batal' : '+ Tambah Produk Baru'}
                </button>
            </div>

            {/* FORM INPUT B2B */}
            {isAddMode && (
                <form onSubmit={handleAddProduct} className="mb-10 p-8 bg-gray-50/50 rounded-3xl border border-gray-200 animate-in slide-in-from-top-4">
                    <h4 className="font-bold text-slate-900 mb-6 text-lg">Input Spesifikasi Produk</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Kolom 1: Info Dasar */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Varietas</label>
                                <input required placeholder="Contoh: Golden Apollo" className={inputClass} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tipe Varietas</label>
                                <select className={inputClass} value={newProduct.variety_type} onChange={e => setNewProduct({ ...newProduct, variety_type: e.target.value })}>
                                    <option>Net Melon</option>
                                    <option>Smooth Skin</option>
                                    <option>Exotic</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Harga / Ton (IDR)</label>
                                <input required type="number" placeholder="0" className={inputClass} value={newProduct.price_per_ton || ''} onChange={e => setNewProduct({ ...newProduct, price_per_ton: Number(e.target.value) })} />
                            </div>
                        </div>

                        {/* Kolom 2: Spesifikasi Teknis */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Grade</label>
                                    <select className={inputClass} value={newProduct.grade} onChange={e => setNewProduct({ ...newProduct, grade: e.target.value })}>
                                        <option>AA</option>
                                        <option>A</option>
                                        <option>B</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Status</label>
                                    <select className={inputClass} value={newProduct.status} onChange={e => setNewProduct({ ...newProduct, status: e.target.value })}>
                                        <option value="available">Tersedia</option>
                                        <option value="limited">Terbatas</option>
                                        <option value="out">Habis</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Min Brix</label>
                                    <input type="number" placeholder="12" className={inputClass} value={newProduct.avg_brix_min || ''} onChange={e => setNewProduct({ ...newProduct, avg_brix_min: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Max Brix</label>
                                    <input type="number" placeholder="14" className={inputClass} value={newProduct.avg_brix_max || ''} onChange={e => setNewProduct({ ...newProduct, avg_brix_max: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">MOQ (Kg)</label>
                                    <input type="number" placeholder="1000" className={inputClass} value={newProduct.moq_kg || ''} onChange={e => setNewProduct({ ...newProduct, moq_kg: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Cap. (Ton/Wk)</label>
                                    <input type="number" step="0.1" placeholder="5" className={inputClass} value={newProduct.supply_cap_ton_week || ''} onChange={e => setNewProduct({ ...newProduct, supply_cap_ton_week: Number(e.target.value) })} />
                                </div>
                            </div>
                        </div>

                        {/* Kolom 3: Logistik & Gambar */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Lead Time (Hari)</label>
                                <input type="number" placeholder="3" className={inputClass} value={newProduct.lead_time_days || ''} onChange={e => setNewProduct({ ...newProduct, lead_time_days: Number(e.target.value) })} />
                            </div>

                            {/* Upload Gambar */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Foto Produk</label>
                                <div className="relative h-24 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition cursor-pointer flex flex-col items-center justify-center text-gray-400 overflow-hidden group">
                                    {previewUrl ? (
                                        <img src={previewUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <UploadCloud size={20} />
                                            <span className="text-[10px] mt-1">Upload JPG/PNG</span>
                                        </div>
                                    )}
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button disabled={loading || uploading} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-70">
                        {(loading || uploading) ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {uploading ? 'Mengupload Gambar...' : 'Simpan ke Katalog B2B'}
                    </button>
                </form>
            )}

            {/* TABEL KATALOG */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr className="text-gray-500 text-xs uppercase tracking-wider font-bold">
                            <th className="p-4 pl-6">Produk</th>
                            <th className="p-4">Specs (Grade/Brix)</th>
                            <th className="p-4">Logistik (Cap/MOQ)</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right pr-6">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-emerald-50/30 transition group">
                                <td className="p-4 pl-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                                        {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{p.name}</p>
                                        <p className="text-xs text-gray-500">{p.variety_type}</p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold mr-2">Grade {p.grade}</span>
                                    <span className="text-slate-500 text-xs">Brix: {p.avg_brix_min}-{p.avg_brix_max}</span>
                                </td>
                                <td className="p-4">
                                    <p className="font-medium text-slate-800">{p.supply_cap_ton_week} Ton/Wk</p>
                                    <p className="text-xs text-gray-400">MOQ: {p.moq_kg} Kg | Lead: {p.lead_time_days} hr</p>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        p.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 
                                        p.status === 'limited' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {p.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && products.length === 0 && <div className="text-center py-10 text-gray-400">Katalog Kosong</div>}
            </div>
        </div>
    );
}