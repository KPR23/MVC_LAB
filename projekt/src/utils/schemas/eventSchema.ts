import * as z from 'zod';

export const eventFormSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany'),
  artists: z.string().min(1, 'Artysta/Artyści są wymagani'),
  organizer: z.string().min(1, 'Organizator jest wymagany'),
  description: z.string().min(1, 'Opis jest wymagany'),
  category: z
    .array(z.string())
    .nonempty('Proszę wybrać co najmniej jedną kategorię'),
  city: z.string().min(1, 'Miasto jest wymagane'),
  location: z.string().min(1, 'Nazwa obiektu jest wymagana'),
  dateFrom: z.string().min(1, 'Data jest wymagana'),
  dateTo: z.string().min(1, 'Data jest wymagana'),
  time: z.string().min(1, 'Czas jest wymagany'),
  capacity: z.coerce.number().min(1, 'Pojemność musi być większa niż 0'),
  imageUrl: z.string().url('Niepoprawny adres URL'),
  price: z.coerce.number().min(0, 'Cena musi być większa lub równa 0'),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
