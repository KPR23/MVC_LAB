'use server';

import db from '@/src/server/db/drizzle';
import { users } from '@/src/server/db/schema';
import { createSession, deleteSession } from '@/src/app/actions/session';
import { FormState, SignupFormSchema } from '@/src/utils/schemas/authSchema';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

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
  redirect('/profile');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
