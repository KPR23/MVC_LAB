import { UTApi } from 'uploadthing/server';
import { verifySession } from '@/src/server/db/dal';

const utapi = new UTApi();

export async function POST(req: Request) {
  try {
    const session = await verifySession();
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const { fileKey } = await req.json();

    if (!fileKey) {
      return new Response(JSON.stringify({ error: 'File key is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const response = await utapi.deleteFiles(fileKey);

    return new Response(JSON.stringify({ success: true, response }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to delete file',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
