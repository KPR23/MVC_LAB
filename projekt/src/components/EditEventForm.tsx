'use client';

import { Button } from '@/src/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import {
  ArtistFormValues,
  eventFormSchema,
  EventFormValues,
} from '@/src/utils/schemas/eventSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useUploadThing } from '../utils/uploadthing';
import { DatePickerWithRange } from './ui/datepicker';

const EVENT_CATEGORIES = [
  { id: 'Muzyka', label: 'Muzyka' },
  { id: 'Sport', label: 'Sport' },
  { id: 'Sztuka', label: 'Sztuka' },
  { id: 'Teatr', label: 'Teatr' },
  { id: 'Inne', label: 'Inne' },
] as const;

export default function EditEventForm(event: EventFormValues) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing('imageUploader', {
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
    onClientUploadComplete: () => {
      setIsUploading(false);
      setUploadProgress(100);
    },
    onUploadError: (error) => {
      setIsUploading(false);
      console.error('Upload error:', error);
      toast.error('Błąd podczas przesyłania plakatu. Spróbuj ponownie.');
    },
  });

  const formValues = {
    ...event,
    price: event.price / 100,
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: formValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'artists',
  });

  const handleFileSelected = (file: File) => {
    setImageFile(file);
    const fileUrl = URL.createObjectURL(file);
    form.clearErrors('imageUrl');
  };

  async function handleDelete(eventId: string) {
    try {
      const response = await fetch(`/api/events`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: eventId }),
      });

      if (response.ok) {
        if (event.imageUrl) {
          try {
            const urlParts = event.imageUrl.split('/');
            const fileKey = urlParts[urlParts.length - 1].split('?')[0];

            const imageDeleteResponse = await fetch('/api/uploadthing/delete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ fileKey }),
            });

            if (imageDeleteResponse.ok) {
              console.log('Image file deleted successfully');
            } else {
              console.error('Failed to delete image file from storage');
            }
          } catch (imageError) {
            console.error('Error deleting image:', imageError);
          }
        }

        toast.success('Wydarzenie usunięte pomyślnie');
        router.push('/events');
        return true;
      } else {
        toast.error('Nie udało się usunąć wydarzenia');
        return false;
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Nie udało się usunąć wydarzenia');
      return false;
    }
  }

  async function onSubmit(values: EventFormValues) {
    try {
      setLoading(true);

      if (imageFile) {
        try {
          setUploadProgress(0);
          setIsUploading(true);

          const uploadResponse = await startUpload([imageFile]);

          if (uploadResponse && uploadResponse[0]?.url) {
            values.imageUrl = uploadResponse[0].url;
            form.setValue('imageUrl', uploadResponse[0].url);
          } else {
            throw new Error(
              'Nie udało się uzyskać adresu URL przesłanego obrazu.'
            );
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error('Błąd podczas przesyłania plakatu. Spróbuj ponownie.');
          setLoading(false);
          setIsUploading(false);
          return;
        }
      }

      if (!values.imageUrl) {
        values.imageUrl = '';
      }

      const eventInputData = formatEventData(values);

      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventInputData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add event');
      }

      toast.success('Wydarzenie zaktualizowane pomyślnie!');
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
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EventDetailsSection
            form={form}
            fields={fields}
            append={append}
            remove={remove}
          />
          <LocationAndDateSection
            form={form}
            onFileSelected={handleFileSelected}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            initialImageUrl={event.imageUrl}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            className="hover:bg-destructive"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleDelete(event.id!);
            }}
          >
            Usuń wydarzenie
          </Button>
          <Button type="submit" disabled={loading || isUploading}>
            {loading || isUploading
              ? 'Przetwarzanie...'
              : 'Zaktualizuj wydarzenie'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

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

  const artists = values.artists.map((artist) => ({
    ...artist,
    id: artist.id || crypto.randomUUID(),
  }));

  return {
    id: values.id,
    title: values.title,
    description: values.description,
    artists: artists,
    organizer: values.organizer,
    category: values.category,
    city: values.city,
    location: values.location,
    imageUrl: values.imageUrl,
    dateFrom: dateOnlyString,
    dateTo: dateOnlyStringTo,
    time: values.time,
    capacity: values.capacity,
    availableSeats: values.capacity,
    price: Math.round(values.price * 100),
  };
}

function EventDetailsSection({
  form,
  fields,
  append,
  remove,
}: {
  form: ReturnType<typeof useForm<EventFormValues>>;
  fields: ReturnType<typeof useFieldArray>['fields'];
  append: (value: ArtistFormValues) => void;
  remove: (index: number) => void;
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

      <div>
        <FormLabel className="mb-2">Artyści</FormLabel>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`artists.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Nazwa artysty"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => append({ name: '' })}
          >
            <Plus className="h-4 w-4" /> Dodaj kolejnego artystę
          </Button>
        </div>
        {form.formState.errors.artists?.message && (
          <p className="text-sm font-medium text-destructive mt-2">
            {form.formState.errors.artists.message}
          </p>
        )}
      </div>

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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {EVENT_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
  onFileSelected,
  uploadProgress,
  isUploading,
  initialImageUrl,
}: {
  form: ReturnType<typeof useForm<EventFormValues>>;
  onFileSelected: (file: File) => void;
  uploadProgress: number;
  isUploading: boolean;
  initialImageUrl?: string;
}) {
  const [previewUrl, setPreviewUrl] = useState<string>(initialImageUrl || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error('Plik jest za duży. Maksymalny rozmiar to 4MB.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Wybierz plik graficzny (JPG, PNG, GIF, itp.)');
        return;
      }

      onFileSelected(file);
    }
  };

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

                      if (range.to) {
                        form.setValue(
                          'dateTo',
                          range.to.toISOString().split('T')[0]
                        );
                      } else {
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
            <FormLabel>Plakat wydarzenia</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <input type="hidden" {...field} />
                <div className="flex flex-col items-center gap-4">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    {previewUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={previewUrl}
                          alt="Podgląd plakatu"
                          fill
                          className="object-contain"
                        />
                        {isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="text-white text-center">
                              <div className="mb-2">
                                Przesyłanie... {uploadProgress}%
                              </div>
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : field.value ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={field.value}
                          alt="Plakat wydarzenia"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1">
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Kliknij, aby dodać plakat wydarzenia
                        </p>
                        <p className="text-xs text-gray-400">
                          (max 4MB, formaty: JPG, PNG)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Dodaj plakat promujący wydarzenie.
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
              <div className="relative">
                <Input
                  placeholder="194.99"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-12"
                  {...field}
                  value={isNaN(field.value) ? '' : field.value}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(
                      value === '' ? undefined : parseFloat(value)
                    );
                  }}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  PLN
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
