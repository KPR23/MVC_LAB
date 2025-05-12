'use client';

import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import {
  eventFormSchema,
  EventFormValues,
} from '@/src/utils/schemas/eventSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { toast } from 'sonner';
import { DatePickerWithRange } from './ui/datepicker';

const EVENT_CATEGORIES = [
  { id: 'Muzyka', label: 'Muzyka' },
  { id: 'Sport', label: 'Sport' },
  { id: 'Sztuka', label: 'Sztuka' },
  { id: 'Teatr', label: 'Teatr' },
  { id: 'Inne', label: 'Inne' },
] as const;

const DEFAULT_VALUES: EventFormValues = {
  title: '',
  artists: '',
  organizer: '',
  description: '',
  category: ['Muzyka'],
  city: '',
  location: '',
  capacity: 1,
  imageUrl: '',
  price: 0,
  dateFrom: '',
  dateTo: '',
  time: '',
};

export default function AddEventForm() {
  const router = useRouter();
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  async function onSubmit(values: EventFormValues) {
    try {
      const eventInputData = formatEventData(values);

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
          <EventDetailsSection form={form} />
          <LocationAndDateSection form={form} />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Dodaj wydarzenie</Button>
        </div>
      </form>
    </Form>
  );
}

// Helper to format the event data for API submission
function formatEventData(values: EventFormValues) {
  const [year, month, day] = values.dateFrom.split('-').map(Number);
  const [yearTo, monthTo, dayTo] = values.dateTo.split('-').map(Number);
  const [hours, minutes] = values.time.split(':').map(Number);

  const eventDateFromObject = new Date(year, month - 1, day, hours, minutes);
  const eventDateToObject = new Date(
    yearTo,
    monthTo - 1,
    dayTo,
    hours,
    minutes
  );

  if (
    isNaN(eventDateFromObject.getTime()) ||
    isNaN(eventDateToObject.getTime())
  ) {
    throw new Error('Invalid date or time provided.');
  }

  const dateOnlyString = eventDateFromObject.toISOString().split('T')[0];
  const dateOnlyStringTo = eventDateToObject.toISOString().split('T')[0];

  return {
    title: values.title,
    description: values.description,
    artists: values.artists,
    organizer: values.organizer,
    category: values.category.join(', '),
    city: values.city,
    location: values.location,
    imageUrl: values.imageUrl,
    dateFrom: dateOnlyString,
    dateTo: dateOnlyStringTo,
    time: values.time,
    capacity: values.capacity,
    availableSeats: values.capacity,
    price: values.price,
  };
}

function EventDetailsSection({
  form,
}: {
  form: ReturnType<typeof useForm<EventFormValues>>;
}) {
  return (
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
              Nazwa firmy lub osoby odpowiedzialnej za organizację wydarzenia.
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
              <Textarea placeholder="" className="resize-none" {...field} />
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
              {EVENT_CATEGORIES.map((item) => (
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
  );
}

function LocationAndDateSection({
  form,
}: {
  form: ReturnType<typeof useForm<EventFormValues>>;
}) {
  return (
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

      <div className="flex items-center space-x-2 w-full">
        <FormField
          control={form.control}
          name="dateFrom"
          render={({ field }) => (
            <FormItem className="w-2/3">
              <FormLabel>Data wydarzenia</FormLabel>
              <FormControl>
                <DatePickerWithRange
                  className="w-full"
                  date={{
                    from: field.value ? new Date(field.value) : undefined,
                    to: form.getValues('dateTo')
                      ? new Date(form.getValues('dateTo'))
                      : undefined,
                  }}
                  onSelect={(range) => {
                    if (range?.from) {
                      field.onChange(range.from.toISOString().split('T')[0]);

                      // Update dateTo if from is set
                      if (range.to) {
                        form.setValue(
                          'dateTo',
                          range.to.toISOString().split('T')[0]
                        );
                      } else {
                        // If no end date, set the same as start date
                        form.setValue(
                          'dateTo',
                          range.from.toISOString().split('T')[0]
                        );
                      }
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
            <FormItem className="w-1/3">
              <FormLabel>Godzina rozpoczęcia</FormLabel>
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
                min="1"
                {...field}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseInt(e.target.value, 10) : 1
                  )
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
              <Textarea placeholder="" className="resize-none" {...field} />
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
                min="0"
                step="0.01"
                {...field}
                value={isNaN(field.value) ? '' : field.value}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? undefined : parseFloat(value));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
