'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowLeft, Loader2, Leaf, Eye, EyeOff, Briefcase, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('supplier');
    const [companyName, setCompanyName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fullName,
                    email,
                    password,
                    role,
                    company_name: companyName,
                    phone,
                })
            });

            let data;
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                const textError = await res.text();
                console.error("Non-JSON response from server:", textError);
                throw new Error("Terjadi kesalahan pada server. Silakan coba lagi.");
            }

            if (!res.ok) {
                throw new Error(data?.error || "Gagal mendaftar.");
            }

            toast.success("Akun berhasil dibuat! Mengalihkan...");

            router.refresh();
            if (data?.user?.role === 'admin') {
                setTimeout(() => router.push('/dashboard'), 1500);
            } else {
                setTimeout(() => router.push('/supplier'), 1500);
            }

        } catch (err: any) {
            toast.error(err.message || "Gagal mendaftar.");
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.2 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="flex min-h-screen bg-white overflow-hidden">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 bg-emerald-900 relative overflow-hidden"
            >
                <img
                    src="https://images.unsplash.com/photo-1508857650881-64475119d798?q=80&w=1170&auto=format&fit=crop"
                    alt="Greenhouse Modern"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-linear-to-t from-emerald-950 via-emerald-900/80 to-emerald-800/50"></div>
                <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
                    <motion.div variants={itemVariants} className="bg-emerald-700/30 backdrop-blur-md p-3 rounded-2xl inline-block w-fit mb-8 border border-emerald-600/50">
                        <Leaf className="w-8 h-8 text-emerald-300" />
                    </motion.div>

                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h1 variants={itemVariants} className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                            Bergabung dengan <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-teal-200">Komunitas Petani Modern.</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-lg text-emerald-100/90 mb-10 leading-relaxed max-w-xl">
                            Dapatkan akses ke teknologi Smart Farming, pasar B2B eksklusif, dan manajemen RFQ serta Kontrak Suplai.
                        </motion.p>
                    </motion.div>

                    <motion.p variants={itemVariants} className="text-sm text-emerald-300/70 mt-8">
                        © 2024 Central Melon. Agriculture 4.0 Platform.
                    </motion.p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-1/2 flex flex-col justify-center p-6 lg:p-16 bg-gray-50/50"
            >
                <div className="max-w-[450px] mx-auto w-full">
                    <Link href="/" className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition-colors mb-4 group font-medium">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
                    </Link>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-100/60 border border-white"
                    >
                        <motion.div variants={itemVariants} className="text-center mb-6">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Buat Akun Baru 🚀</h2>
                            <p className="text-gray-600">Mulai perjalanan B2B cerdas Anda.</p>
                        </motion.div>

                        <form onSubmit={handleRegister} className="space-y-4">

                            {/* Pilihan Role */}
                            <motion.div variants={itemVariants} className="flex gap-4">
                                <label className="flex-1 cursor-pointer">
                                    <input type="radio" name="role" value="supplier" checked={role === 'supplier'} onChange={() => setRole('supplier')} className="peer sr-only" />
                                    <div className="text-center py-3 border-2 rounded-xl peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 font-semibold transition-all">
                                        Supplier / Buyer
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                    <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} className="peer sr-only" />
                                    <div className="text-center py-3 border-2 rounded-xl peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 font-semibold transition-all">
                                        Admin Farm
                                    </div>
                                </label>
                            </motion.div>

                            {/* Input Nama Lengkap */}
                            <motion.div variants={itemVariants} className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-0 outline-none transition-all bg-gray-50/50 focus:bg-white"
                                    placeholder="Nama Lengkap"
                                    required
                                />
                            </motion.div>

                            {/* Input Email */}
                            <motion.div variants={itemVariants} className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-0 outline-none transition-all bg-gray-50/50 focus:bg-white"
                                    placeholder="Email Address"
                                    required
                                />
                            </motion.div>

                            {/* Input Nama Perusahaan */}
                            <motion.div variants={itemVariants} className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-0 outline-none transition-all bg-gray-50/50 focus:bg-white"
                                    placeholder="Nama Perusahaan (B2B)"
                                />
                            </motion.div>

                            {/* Input No HP */}
                            <motion.div variants={itemVariants} className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-0 outline-none transition-all bg-gray-50/50 focus:bg-white"
                                    placeholder="No. Handphone"
                                />
                            </motion.div>

                            {/* Input Password */}
                            <motion.div variants={itemVariants} className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-0 outline-none transition-all bg-gray-50/50 focus:bg-white"
                                    placeholder="Kata Sandi (Min. 6 Karakter)"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </motion.div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01, backgroundColor: '#047857' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-600/30 transition-all mt-6 flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Daftar Sekarang'}
                            </motion.button>
                        </form>

                        <motion.p variants={itemVariants} className="text-center text-gray-600 mt-6 font-medium text-sm">
                            Sudah punya akun? <Link href="/login" className="text-emerald-600 hover:text-emerald-800 font-bold transition-colors hover:underline">Login di sini</Link>
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}