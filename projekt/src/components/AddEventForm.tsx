'use client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from './ui/multi-select';
import { DatetimePicker } from './ui/datetime-picker';

const formSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany'),
  artists: z.string().min(1, 'Artysta/Artyści są wymagani'),
  organizer: z.string().min(1, 'Organizator jest wymagany'),
  description: z.string(),
  category: z
    .array(z.string())
    .nonempty('Proszę wybrać co najmniej jedną kategorię'),
  city: z.string().min(1, 'Miasto jest wymagane'),
  location: z.string().min(1, 'Lokalizacja jest wymagana'),
  'date-time': z.coerce.date(),
  capacity: z.coerce.number().min(1, 'Pojemność musi być większa niż 0'),
  name_6842191087: z.string().optional(), // Pole opcjonalne
  price: z.coerce.number().min(0, 'Cena musi być większa lub równa 0'), // Cena może być 0
});

export default function AddEventForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: [], // Ustawienie pustej tablicy domyślnie
      'date-time': new Date(),
      capacity: 1,
      price: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Lewa Kolumna */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł wydarzenia</FormLabel>
                  <FormControl>
                    <Input placeholder="Open’er Festival" {...field} />
                  </FormControl>
                  <FormDescription>
                    Pełna nazwa wydarzenia, która będzie widoczna dla
                    wszystkich.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artists"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artysta/Artyści</FormLabel>
                  <FormControl>
                    <Input placeholder="Linkin Park" {...field} />
                  </FormControl>
                  <FormDescription>
                    Imię i nazwisko lub nazwa wykonawcy/wykonawców.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organizer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizator</FormLabel>
                  <FormControl>
                    <Input placeholder="Magnetowid Sp. z o.o." {...field} />
                  </FormControl>
                  <FormDescription>
                    Nazwa firmy lub osoby odpowiedzialnej za organizację
                    wydarzenia.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis wydarzenia</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Pełny opis wydarzenia.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoria</FormLabel>
                  <FormControl>
                    <MultiSelector
                      values={field.value}
                      onValuesChange={field.onChange}
                      loop
                      className="max-w-xs"
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder="Wybierz kategorie" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {/* Dodaj więcej opcji kategorii tutaj */}
                          <MultiSelectorItem value={'Koncert'}>
                            Koncert
                          </MultiSelectorItem>
                          <MultiSelectorItem value={'Wystawa'}>
                            Wystawa
                          </MultiSelectorItem>
                          <MultiSelectorItem value={'Szkolenie'}>
                            Szkolenie
                          </MultiSelectorItem>
                          <MultiSelectorItem value={'Sport'}>
                            Sport
                          </MultiSelectorItem>
                          <MultiSelectorItem value={'Inne'}>
                            Inne
                          </MultiSelectorItem>
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </FormControl>
                  <FormDescription>
                    Kategoria, do której należy wydarzenie.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Prawa Kolumna */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Miasto</FormLabel>
                  <FormControl>
                    <Input placeholder="Warszawa" {...field} />
                  </FormControl>
                  <FormDescription>
                    Miasto, w którym odbędzie się wydarzenie.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokalizacja</FormLabel>
                  <FormControl>
                    <Input placeholder="Klub Progresja" {...field} />
                  </FormControl>
                  <FormDescription>Pełna nazwa obiektu.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date-time"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data i godzina wydarzenia</FormLabel>
                  <DatetimePicker
                    {...field}
                    format={[
                      ['months', 'days', 'years'],
                      ['hours', 'minutes', 'am/pm'],
                    ]}
                  />
                  <FormDescription>
                    Pełna data i godzina rozpoczęcia wydarzenia.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pojemność obiektu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="500"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      } // Konwersja na liczbę
                    />
                  </FormControl>
                  <FormDescription>
                    Całkowita pojemność miejsca wydarzenia.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_6842191087"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres URL okładki</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link do zdjęcia promującego wydarzenie.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cena w groszach</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="19499 (194,99 zł)"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      } // Konwersja na liczbę
                    />
                  </FormControl>
                  <FormDescription>
                    Koszt biletu lub uczestnictwa w wydarzeniu.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Dodaj wydarzenie</Button>
        </div>
      </form>
    </Form>
  );
}
