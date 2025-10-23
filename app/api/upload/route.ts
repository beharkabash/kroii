import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    // Create /public/cars directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'cars');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedFiles: { url: string; name: string }[] = [];

    for (const file of files) {
      // Get file extension
      const fileExt = file.name.split('.').pop() || 'jpg';
      
      // Generate unique filename (timestamp + random)
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const fileName = `car-${timestamp}-${random}.${fileExt}`;
      
      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save file to /public/cars/
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      // Return public URL
      uploadedFiles.push({
        url: `/cars/${fileName}`,
        name: file.name
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

// Enable file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
