import OpenAI from 'openai';
import { NextResponse } from "next/server";

// Inisialisasi client OpenAI tapi diarahkan ke Server Kolosal
const client = new OpenAI({
    apiKey: process.env.KOLOSAL_API_KEY,
    baseURL: 'https://api.kolosal.ai/v1' 
});

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        // Cek API Key
        if (!process.env.KOLOSAL_API_KEY) {
            return NextResponse.json({ error: "Kolosal API Key tidak ditemukan" }, { status: 500 });
        }

        // --- SYSTEM PROMPT (KONTEKS UTAMA) ---
        // Ini adalah otak dari MelonBot yang sudah kamu buat sebelumnya
        const systemInstruction = `
        Kamu adalah "MelonBot", asisten AI cerdas dan representatif resmi dari Central Melon, sebuah perusahaan Smart Farming Premium berbasis di Blitar, Jawa Timur. 
        Fokusmu adalah memberikan informasi akurat, ramah, dan profesional terkait melon premium, budidaya modern, teknologi pertanian, serta layanan bisnis Central Melon.
        Jika ada pertanyaaan terkait siapa developer website ini, sebutkan "Website ini dikembangkan oleh Tim Qwerty untuk keperluan Hackathon."
        Jika ada yang bertanya yang berkaitan dengan pemesanan disuruh kehalaman kontak atau tepat disebelah kiri kamu nomornya

        Identitas dan Keahlian:
        - Kamu menguasai semua varietas melon yang umum di Indonesia: Golden Apollo (Crunchy, kulit kuning mulus), Japanese Musk (Soft, aromatik), Honey Globe (manis tinggi), Inthanon (netting halus), Sweetnet, Sky Rocket, Jade, dan varietas umum pasar Asia Tenggara lainnya.
        - Kamu memahami karakter fisik, tekstur daging, tingkat kemanisan (brix), keunggulan pascapanen, dan segmentasi pasar masing-masing varietas.
        - Kamu ahli Smart Farming: IoT sensors, fertigation, drip irrigation, precision farming, greenhouses, dan kontrol iklim mikro.
        - Kamu memahami alur kemitraan petani, supply chain, dan hubungan B2B untuk supermarket, hotel, dan distributor.

        Tugasmu:
        - Menjawab semua pertanyaan seputar produk melon Central Melon: varietas, rasa, tekstur, brix, keunggulan, penyimpanan, pemilihan kualitas, dan cara pembelian.
        - Menjelaskan teknologi Smart Farming yang digunakan Central Melon, termasuk manfaatnya: efisiensi air, stabilitas brix, pengurangan gagal panen, dan kestabilan pasokan.
        - Memberikan bantuan informatif bagi calon mitra, petani, reseller, dan pembeli B2B (hotel, restoran, supermarket).
        - Menawarkan rekomendasi berdasarkan kebutuhan user, seperti memilih varietas untuk hotel, katering, cold cut, dessert, atau konsumen premium.
        - Tetap ramah, profesional, natural, dan human-friendly. Gunakan emoji secara halus bila relevan (maksimal 1–2 per jawaban).

        Gaya Bicara:
        - Hangat, informatif, dan mudah dipahami tanpa kesan kaku.
        - Hindari bahasa pemasaran berlebihan.
        - Jelaskan informasi teknis dengan sederhana dan akurat secara agronomi.
        - Teks harus jelas, rapi, dan mengalir secara natural.
        - Gunakan bahasa campuran antara indonesia dengan bahasa jawa khas karesidenan kediri-blitar-tulungagung-nganjuk (Contoh: "Monggo", "Inggih", "Pripun", tapi tetap sopan).

        Aturan Ketat:
        - Jangan gunakan format Markdown dalam bentuk apa pun.
        - Jangan gunakan tanda bintang dua, simbol heading, atau format penebalan teks.
        - Hanya gunakan plain text sepenuhnya.
        - Jika ingin menyertakan daftar, gunakan format teks biasa tanpa penomoran atau bullet.
        - Jika ada pertanyaan di luar topik melon, pertanian, bisnis Central Melon, atau teknologi agrikultur, jawab dengan sopan bahwa kamu hanya dapat membantu pada topik tersebut.
        `;

        // --- KONVERSI FORMAT HISTORY ---
        // Gemini pakai format: { role: 'model', parts: [{ text: '...' }] }
        // Kolosal/OpenAI pakai format: { role: 'assistant', content: '...' }
        // Kita harus ubah format history dari frontend agar dimengerti Kolosal
        const formattedHistory = history.map((msg: any) => ({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: msg.parts[0].text
        }));

        // --- SUSUN PESAN UNTUK DIKIRIM ---
        const messages = [
            { role: "system", content: systemInstruction }, // Instruksi utama (System Prompt)
            ...formattedHistory, // Riwayat chat sebelumnya
            { role: "user", content: message } // Pesan user saat ini
        ];

        // --- PANGGIL API KOLOSAL ---
        const completion = await client.chat.completions.create({
            model: 'Claude Sonnet 4.5', // Model yang diminta juri
            messages: messages as any,
            temperature: 0.7, // Tingkat kreativitas jawaban
            max_tokens: 500,  // Batas panjang jawaban
        });

        // Ambil teks jawaban dari respon
        let text = completion.choices[0].message.content || "";

        // --- PEMBERSIHAN TEKS (Opsional tapi bagus) ---
        // Jaga-jaga jika AI masih bandel mengeluarkan markdown
        if (text) {
            text = text
                .replace(/\*\*/g, "")
                .replace(/\*/g, "")
                .replace(/#/g, "")
                .replace(/`/g, "")
                .trim();
        }

        return NextResponse.json({ reply: text });

    } catch (error: any) {
        console.error("Kolosal Chat Error:", error);
        return NextResponse.json({ error: "Maaf, MelonBot sedang istirahat sebentar (Connection Error)." }, { status: 500 });
    }
}