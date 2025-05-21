'use client';

import { signup } from '@/src/app/actions/auth';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { TitleBox } from '..';
import { Button } from '../ui/button';
import { Form, FormControl, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  const form = useForm();

  return (
    <div className="flex flex-col mb-50 h-full max-h-screen">
      <TitleBox
        action="Stwórz konto"
        featuredTitle="w Eventix"
        description="Stwórz konto, aby kupować bilety na wydarzenia"
        button={false}
      />
      <div className="w-full max-w-md mx-auto space-y-6">
        <Form {...form}>
          <form action={action} className="space-y-4">
            <FormItem>
              <FormLabel>Imię</FormLabel>
              <FormControl>
                <Input id="name" name="name" placeholder="Jan" />
              </FormControl>
              {state?.errors?.name && (
                <p className="text-sm text-destructive mt-1">
                  {state.errors.name}
                </p>
              )}
            </FormItem>

            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jan.kowalski@gmail.com"
                />
              </FormControl>
              {state?.errors?.email && (
                <p className="text-sm text-destructive mt-1">
                  {state.errors.email}
                </p>
              )}
            </FormItem>

            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Wprowadź hasło"
                />
              </FormControl>
              {state?.errors?.password && (
                <div className="text-sm text-destructive mt-1">
                  <p>Hasło musi zawierać:</p>
                  <ul className="list-disc list-inside">
                    {state.errors.password.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </FormItem>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? 'Tworzenie konta...' : 'Stwórz konto'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
