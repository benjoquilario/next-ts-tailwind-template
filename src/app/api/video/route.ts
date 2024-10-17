import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  let src = searchParams.get('src') || '';
  let referer = searchParams.get('referer') || '';

  const options = {
    headers: {
      Referer: referer,
    },
  };

  const response = await fetch(src, options);

  return new Response(response.body);
}
