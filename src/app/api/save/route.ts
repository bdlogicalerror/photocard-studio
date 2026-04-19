import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

export async function POST(request: Request) {
  try {
    const { filename } = await request.json();
    if (!filename) {
      return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
    }

    const safeFilename = path.basename(filename);
    const sourcePath = path.join(os.tmpdir(), safeFilename);
    const targetDir = path.join(process.cwd(), 'public', 'exports');
    const targetPath = path.join(targetDir, safeFilename);

    // Ensure target directory exists
    try {
      await fs.mkdir(targetDir, { recursive: true });
    } catch (e) {}

    // Check if source exists
    try {
      await fs.access(sourcePath);
    } catch (e) {
      return NextResponse.json({ error: 'Temporary file not found' }, { status: 404 });
    }

    // Move file (copy then delete to handle cross-device links if needed)
    await fs.copyFile(sourcePath, targetPath);
    await fs.unlink(sourcePath);

    return NextResponse.json({ 
      success: true, 
      filename: safeFilename,
      url: `/exports/${safeFilename}` 
    });
  } catch (error: any) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
