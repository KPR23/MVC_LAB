'use client';

import { login as serverLogin } from '@/src/app/actions/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { TitleBox } from '..';
import { Button } from '../ui/button';
import { Form, FormControl, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

export default function LoginForm() {
  const form = useForm();

  return (
    <div className="flex flex-col mb-50">
      <TitleBox
        action="Witaj"
        featuredTitle="ponownie"
        description="Zaloguj się, aby kontynuować"
        button={false}
      />
      <div className="w-full max-w-md mx-auto space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              const formData = new FormData();
              formData.append('email', data.email);
              formData.append('password', data.password);
              const result = await serverLogin(formData);
              if (result?.error) {
                toast.error(result.error);
              }
            })}
            className="space-y-4"
          >
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="jan.kowalski@gmail.com"
                  {...form.register('email')}
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Wprowadź hasło"
                  {...form.register('password')}
                />
              </FormControl>
            </FormItem>
            <Button type="submit" className="w-full">
              Zaloguj się
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
