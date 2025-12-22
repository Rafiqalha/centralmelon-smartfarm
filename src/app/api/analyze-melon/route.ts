import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    // URL ke Server Python kamu
    const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:8000/predict";

    // Kirim ke Python
    const response = await fetch(ML_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64 }),
    });

    if (!response.ok) {
      throw new Error(`Server Python Error: ${response.status}`);
    }

    const jsonResult = await response.json();
    return NextResponse.json(jsonResult);

  } catch (error: any) {
    console.error("MelonLens Error:", error);
    return NextResponse.json({ 
        error: "Gagal memproses gambar. Pastikan server Python (uvicorn) menyala." 
    }, { status: 500 });
  }
}