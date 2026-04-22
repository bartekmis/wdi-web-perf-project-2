import { NextResponse } from 'next/server';
import { cookies, draftMode } from 'next/headers';


export async function GET() {
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
