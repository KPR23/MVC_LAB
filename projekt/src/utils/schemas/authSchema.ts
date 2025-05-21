import { z } from 'zod';

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nazwa musi mieć co najmniej 2 znaki.' })
    .trim(),
  email: z.string().email({ message: 'Wprowadź poprawny adres email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Hasło musi mieć co najmniej 8 znaków' })
    .regex(/[a-zA-Z]/, {
      message: 'Hasło musi zawierać co najmniej jedną literę.',
    })
    .regex(/[0-9]/, { message: 'Hasło musi zawierać co najmniej jedną cyfrę.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Hasło musi zawierać co najmniej jeden znak specjalny.',
    })
    .trim(),
});

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
