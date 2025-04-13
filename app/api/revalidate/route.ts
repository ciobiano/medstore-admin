    import { NextRequest, NextResponse } from 'next/server';
    import { revalidateTag } from 'next/cache'; 



    export async function GET(request: NextRequest) {
      const secret = request.nextUrl.searchParams.get('secret');
      const tag = request.nextUrl.searchParams.get('tag');

      if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
      }

      if (!tag) {
        return NextResponse.json({ message: 'Missing tag param' }, { status: 400 });
      }

      try {

        
        revalidateTag(tag);
        return NextResponse.json({ revalidated: true, tag: tag, now: Date.now() });
      } catch (error) {
        console.error("Revalidation error:", error);
        return NextResponse.json({ message: 'Error revalidating', error: error }, { status: 500 });
      }
    }