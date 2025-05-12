'use client';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { DatePickerWithRange } from './ui/datepicker';

interface EventFilterProps {
  onFilter: (filters: {
    search?: string;
    category?: string;
    date?: string;
    hasAvailableSeats: boolean;
  }) => void;
}

export default function EventFilter() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [date, setDate] = useState('');
  const [hasAvailableSeats, setHasAvailableSeats] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // setCategories(EventController.getCategories());
  }, []);

  //   const handleFilter = () => {
  //     onFilter({
  //       search: search.trim() !== '' ? search : undefined,
  //       category: category !== 'all' ? category : undefined,
  //       date: date !== '' ? date : undefined,
  //       hasAvailableSeats,
  //     });
  //   };

  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setDate('');
    setHasAvailableSeats(true);

    // onFilter({
    //   hasAvailableSeats: true,
    // });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 flex justify-center">
            <div className="relative w-full">
              <Input
                id="search"
                placeholder="Szukaj wydarzeń..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Wszystkie kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie kategorie</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DatePickerWithRange />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            //   onClick={handleFilter}
            className="flex-1 sm:flex-none"
          >
            Zastosuj filtry
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Wyczyść
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
