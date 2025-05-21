'use server';

import db from '@/src/server/db/drizzle';
import { users } from '@/src/server/db/schema';
import {
  createSession,
  deleteSession,
  decrypt,
} from '@/src/app/actions/session';
import { FormState, SignupFormSchema } from '@/src/utils/schemas/authSchema';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function checkSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;
  const session = await decrypt(cookie);
  return session
    ? {
        isAuth: true,
        userId: session.userId as string,
        name: session.name as string,
      }
    : null;
}

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id });

  const user = data[0];

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    };
  }
  await createSession(user.id);
  redirect('/bookings');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return { error: 'Nie znaleziono użytkownika o podanym adresie e-mail.' };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return { error: 'Nieprawidłowe hasło.' };
  }

  await createSession(user.id);
  redirect('/bookings');
}
