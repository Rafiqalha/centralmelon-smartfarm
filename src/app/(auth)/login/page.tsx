'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Leaf, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
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
                throw new Error(data?.error || "Gagal login. Periksa email/password.");
            }

            router.refresh();
            if (data?.user?.role === 'admin') {
                router.push('/dashboard');
            } else {
                router.push('/supplier');
            }

        } catch (err: any) {
            setErrorMsg(err.message || "Gagal login. Periksa email/password.");
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
            {/* VISUAL */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 bg-emerald-900 relative overflow-hidden"
            >
                <img
                    src="https://plus.unsplash.com/premium_photo-1675040830254-1d5148d9d0dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVsb258ZW58MHx8MHx8fDA%3D"
                    alt="Kebun Melon Modern"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-linear-to-t from-emerald-950 via-emerald-900/80 to-emerald-800/50"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px]"></div>

                <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
                    <motion.div variants={itemVariants} className="bg-emerald-700/30 backdrop-blur-md p-3 rounded-2xl inline-block w-fit mb-8 border border-emerald-600/50">
                        <Leaf className="w-8 h-8 text-emerald-300" />
                    </motion.div>

                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h1 variants={itemVariants} className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                            Revolusi <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-teal-200">Pertanian Melon</span> Digital.
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-lg text-emerald-100/90 mb-10 leading-relaxed max-w-xl">
                            Platform terintegrasi untuk mengelola greenhouse, memantau kualitas brix secara real-time, dan menghubungkan panen premium Anda ke pasar global.
                        </motion.p>
                    </motion.div>

                    <motion.p variants={itemVariants} className="text-sm text-emerald-300/70 mt-8">
                        © 2024 Central Melon. Agriculture 4.0 Platform.
                    </motion.p>
                </div>
            </motion.div>

            {/* FORM */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-1/2 flex flex-col justify-center p-6 lg:p-16 bg-gray-50/50"
            >
                <div className="max-w-[450px] mx-auto w-full">
                    <Link href="/" className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition-colors mb-10 group font-medium">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
                    </Link>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-100/60 border border-white"
                    >
                        <motion.div variants={itemVariants} className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Selamat Datang!</h2>
                            <p className="text-gray-600 text-lg">Masuk untuk kelola pertanian cerdas Anda.</p>
                        </motion.div>

                        {/* Error Message */}
                        {errorMsg && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                                {errorMsg}
                            </div>
                        )}



                        {/* Form dengan Handler onSubmit */}
                        <form onSubmit={handleEmailLogin} className="space-y-6"> {/* EMAIL */}
                            <motion.div variants={itemVariants} className="relative group">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={22} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:border-emerald-500 focus:ring-0 outline-none transition-all peer bg-gray-50/50 focus:bg-white"
                                    placeholder="Email"
                                    id="email"
                                    required
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-500 text-base font-medium transition-all peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm peer-focus:text-emerald-600 peer-focus:bg-white peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-emerald-600 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 cursor-text pointer-events-none"
                                >
                                    Email
                                </label>
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative group">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={22} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:border-emerald-500 focus:ring-0 outline-none transition-all peer bg-gray-50/50 focus:bg-white"
                                    placeholder="Password"
                                    id="password"
                                    required
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-500 text-base font-medium transition-all peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm peer-focus:text-emerald-600 peer-focus:bg-white peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-emerald-600 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 cursor-text pointer-events-none"
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none p-1"
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </motion.div>

                            <motion.button
                                type="submit" 
                                disabled={loading}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01, backgroundColor: '#047857' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-600/30 transition-all focus:ring-4 focus:ring-emerald-500/50 outline-none mt-8 disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Masuk Sekarang'}
                            </motion.button>
                        </form>

                        <motion.p variants={itemVariants} className="text-center text-gray-600 mt-10 font-medium">
                            Belum memiliki akun? <Link href="/register" className="text-emerald-600 hover:text-emerald-800 font-bold transition-colors hover:underline">Register</Link>
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}