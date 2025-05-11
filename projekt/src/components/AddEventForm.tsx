'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
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
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from './ui/datepicker';

const formSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany'),
  artists: z.string().min(1, 'Artysta/Artyści są wymagani'),
  organizer: z.string().min(1, 'Organizator jest wymagany'),
  description: z.string().min(1, 'Opis jest wymagany'),
  category: z
    .array(z.string())
    .nonempty('Proszę wybrać co najmniej jedną kategorię'),
  city: z.string().min(1, 'Miasto jest wymagane'),
  location: z.string().min(1, 'Nazwa obiektu jest wymagana'),
  date: z.string().min(1, 'Data jest wymagana'),
  time: z.string().min(1, 'Czas jest wymagany'),
  capacity: z.coerce.number().min(1, 'Pojemność musi być większa niż 0'),
  imageUrl: z.string().url('Niepoprawny adres URL'),
  price: z.coerce.number().min(0, 'Cena musi być większa lub równa 0'),
});

type FormValues = z.infer<typeof formSchema>;

const eventCategories = [
  { id: 'Muzyka', label: 'Muzyka' },
  { id: 'Sport', label: 'Sport' },
  { id: 'Sztuka', label: 'Sztuka' },
  { id: 'Teatr', label: 'Teatr' },
  { id: 'Inne', label: 'Inne' },
] as const;

type EventCategory = (typeof eventCategories)[number]['id'];

export default function AddEventForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      artists: '',
      organizer: '',
      description: '',
      category: [],
      city: '',
      location: '',
      capacity: 1,
      imageUrl: '',
      price: 0,
      date: '',
      time: '',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const [year, month, day] = values.date.split('-').map(Number);
      const [hours, minutes] = values.time.split(':').map(Number);

      const eventDateObject = new Date(year, month - 1, day, hours, minutes);

      if (isNaN(eventDateObject.getTime())) {
        throw new Error('Invalid date or time provided.');
      }

      const combinedDateTimeString = eventDateObject.toISOString();

      const eventInputData = {
        title: values.title,
        description: values.description,
        artists: values.artists,
        organizer: values.organizer,
        category: values.category.join(', '),
        city: values.city,
        location: values.location,
        imageUrl: values.imageUrl,
        date: combinedDateTimeString,
        time: values.time,
        capacity: values.capacity,
        availableSeats: values.capacity,
        price: values.price,
      };

      console.log('Submitting event data:', eventInputData);

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventInputData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add event');
      }

      toast.success('Wydarzenie dodane pomyślnie!');
      form.reset();
      router.refresh();
      router.push('/events');
    } catch (error) {
      console.error('Form submission error', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to submit the form. Please try again.'
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł wydarzenia</FormLabel>
                  <FormControl>
                    <Input placeholder="Open'er Festival" {...field} />
                  </FormControl>
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
                  <div className="grid grid-cols-2 gap-2">
                    {eventCategories.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="category"
                        render={({ field: categoryField }) => {
                          const checked = categoryField.value.includes(item.id);
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(isChecked) => {
                                    if (isChecked) {
                                      categoryField.onChange([
                                        ...categoryField.value,
                                        item.id,
                                      ]);
                                    } else {
                                      categoryField.onChange(
                                        categoryField.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormDescription>
                    Kategoria, do której należy wydarzenie.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa obiektu</FormLabel>
                  <FormControl>
                    <Input placeholder="Klub Progresja" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => {
                          if (date) {
                            field.onChange(date.toISOString().split('T')[0]);
                          } else {
                            field.onChange('');
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Czas</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres URL plakatu</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link do plakatu promującego wydarzenie.
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
                  <FormLabel>Cena biletu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="194.99"
                      type="number"
                      step="0.01"
                      {...field}
                      value={isNaN(field.value) ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === '' ? undefined : parseFloat(value)
                        );
                      }}
                    />
                  </FormControl>
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
