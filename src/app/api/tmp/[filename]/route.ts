import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  
  // Clean filename to prevent directory traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(os.tmpdir(), safeFilename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    
    // Determine content type based on extension
    const ext = path.extname(safeFilename).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'application/octet-stream';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=60', // Low cache for temporary files
      },
    });
  } catch (error) {
    console.error(`Error serving temporary file ${safeFilename}:`, error);
    return new Response('File not found', { status: 404 });
  }
}
