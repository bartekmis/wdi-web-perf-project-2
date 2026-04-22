import { NextResponse, NextRequest } from 'next/server';
import { cookies, draftMode } from 'next/headers';

const internalIps = ['::1', '10.', '127.'];

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for');
  const cloudFlareInternalUser = request.headers.get('internal-user');

  const isInInternalNetwork =
    internalIps.some((internalIp) => ip?.startsWith(internalIp)) ||
    cloudFlareInternalUser === '1';

  if (!isInInternalNetwork) {
    return NextResponse.json({});
  }

  const cookieStore = await cookies();
  const verboseCookie = cookieStore
    .getAll()
    .find((cookie) => cookie.name === 'verbose');
  if (verboseCookie) {
    cookieStore.delete('verbose');
    (await draftMode()).disable();
  } else {
    (await cookies()).set('verbose', 'true');
    (await draftMode()).enable();
  }

  return NextResponse.json({ verbose: !verboseCookie, access: true });
}

// without this adding sentry gives errors like:
// Attempted import error: 'POST' is not exported from '@ic-it/next-core/src/app/api/revalidate/route' (imported as 'POST$1').
export async function POST() {}
export async function PUT() {}
export async function PATCH() {}
export async function DELETE() {}
export async function OPTIONS() {}
export async function HEAD() {}
