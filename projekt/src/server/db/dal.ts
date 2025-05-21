import 'server-only';

import { decrypt } from '@/src/app/actions/session';
import db from '@/src/server/db/drizzle';
import { users } from '@/src/server/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { cache } from 'react';

type Session = {
  isAuth: boolean;
  userId: string;
} | null;

export const verifySession = cache(async (): Promise<Session> => {
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    console.log('No session found');
    redirect('/login');
  }

  return { isAuth: true, userId: session.userId as string };
});

export const verifyApiSession = async (request: NextRequest) => {
  const cookie = request.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return null;
  }

  return { isAuth: true, userId: session.userId };
};

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId as string),
      columns: {
        id: true,
        name: true,
        email: true,
      },
    });

    const user = data[0];

    return user;
  } catch (error) {
    console.log('Failed to fetch user');
    return null;
  }
});
