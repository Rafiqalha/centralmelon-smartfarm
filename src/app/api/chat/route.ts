import OpenAI from 'openai';
import { NextResponse } from "next/server";

// Inisialisasi Client Kolosal
const client = new OpenAI({
    apiKey: process.env.KOLOSAL_API_KEY,
    baseURL: 'https://api.kolosal.ai/v1'
});

export async function POST(req: Request) {
    try {
        const { imageBase64 } = await req.json();

        if (!process.env.KOLOSAL_API_KEY) {
            return NextResponse.json({ error: "Kolosal API Key tidak ditemukan" }, { status: 500 });
        }

        const systemInstruction = `
        Anda adalah AI Ahli Agronomi dan Spesialis Melon (MelonLens). 
        Tugas anda adalah menganalisis gambar buah yang diunggah.

        Lakukan analisis langkah demi langkah berikut:
        1. **Deteksi Objek**: Apakah gambar ini memuat buah Melon utuh atau potongan? Jika BUKAN melon (misal: manusia, mobil, atau buah lain), kembalikan status "invalid".
        2. **Analisis Kulit (Skin Analysis)**: 
            - Apakah ada jaring (netting)? 
            - Jika ada, seberapa rapat? (Tebal/Rapat/Jarang/Tidak Ada).
            - Apa warna kulit dasarnya? (Hijau/Kuning/Putih/Krem).
        3. **Identifikasi Varietas**: Berdasarkan tekstur kulit dan warna, tentukan jenisnya (misal: Rock Melon, Golden Apollo, Honey Globe, Inthanon, Sky Rocket, dll).
        4. **Estimasi Kualitas Visual**: Apakah bentuknya bulat sempurna? Apakah ada bercak penyakit atau cacat fisik?
        
        Output WAJIB dalam format JSON murni tanpa markdown.
        Format JSON yang diharapkan:
        {
            "is_melon": true,
            "variety": "Nama Varietas (misal: Rock Melon)",
            "skin_texture": "Deskripsi tekstur (misal: Netting tebal dan rapat)",
            "skin_color": "Warna kulit",
            "health_status": "Sehat / Ada Bercak / Cacat",
            "analysis": "Kesimpulan paragraf pendek tentang kualitas melon ini.",
            "confidence": 95
        }

        Jika bukan melon:
        {
            "is_melon": false,
            "analysis": "Objek yang dideteksi bukan buah melon. Mohon unggah foto buah melon yang jelas."
        }
        `;

        const completion = await client.chat.completions.create({
            model: 'Claude Sonnet 4.5', 
            messages: [
                { role: "system", content: systemInstruction },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analisis gambar ini dan berikan output JSON." },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${imageBase64}`
                            }
                        }
                    ]
                }
            ] as any, 
            temperature: 0.2,
            max_tokens: 1000,
        });

        let text = completion.choices[0].message.content || "{}";

        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const jsonResult = JSON.parse(text);

        return NextResponse.json(jsonResult);

    } catch (error: any) {
        console.error("Kolosal Vision Error:", error);
        return NextResponse.json({
            error: "Gagal memproses gambar. Pastikan format JPG/PNG dan ukuran tidak terlalu besar."
        }, { status: 500 });
    }
}