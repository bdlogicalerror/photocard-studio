import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  
  // In Docker standalone, process.cwd() is the root where server.js lives.
  // The 'public/exports' folder is mounted via volume there.
  const filePath = path.join(process.cwd(), 'public', 'exports', filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    
    // Determine content type based on extension
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'application/octet-stream';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=60', // Low cache since these are often temporary/dynamic
      },
    });
  } catch (error) {
    console.error(`Error serving export file ${filename}:`, error);
    return new Response('File not found', { status: 404 });
  }
}
