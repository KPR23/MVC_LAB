import * as z from 'zod';

export const artistSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nazwa artysty jest wymagana'),
});

export const eventFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Tytuł jest wymagany'),
  artists: z
    .array(artistSchema)
    .min(1, 'Wymagany jest co najmniej jeden artysta'),
  organizer: z.string().min(1, 'Organizator jest wymagany'),
  description: z.string().min(1, 'Opis jest wymagany'),
  category: z.string().min(1, 'Proszę wybrać kategorię'),
  city: z.string().min(1, 'Miasto jest wymagane'),
  location: z.string().min(1, 'Nazwa obiektu jest wymagana'),
  dateFrom: z.string().min(1, 'Data jest wymagana'),
  dateTo: z.string().min(1, 'Data jest wymagana'),
  time: z.string().min(1, 'Czas jest wymagany'),
  capacity: z.coerce.number().min(1, 'Pojemność musi być większa niż 0'),
  imageUrl: z.string().url('Niepoprawny adres URL'),
  price: z.coerce.number().min(0, 'Cena musi być większa lub równa 0'),
});

export type ArtistFormValues = z.infer<typeof artistSchema>;
export type EventFormValues = z.infer<typeof eventFormSchema>;
