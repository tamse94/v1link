import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { public_id } = await req.json();
    if (!public_id) return NextResponse.json({ error: 'No public_id' }, { status: 400 });

    const timestamp = Math.round((new Date).getTime() / 1000);
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // Bikin signature (tanda tangan digital) sesuai syarat keamanan Cloudinary
    const str = `public_id=${public_id}&timestamp=${timestamp}${api_secret}`;
    const signature = crypto.createHash('sha1').update(str).digest('hex');

    const formData = new FormData();
    formData.append('public_id', public_id);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    // Tembak API Cloudinary untuk menghancurkan gambar
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/destroy`, {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
