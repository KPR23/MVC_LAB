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
import { Card, CardContent } from './ui/card';
import { DatePickerWithRange } from './ui/datepicker';

const categories = ['Muzyka', 'Sport', 'Teatr', 'Inne'];
export default function EventFilter() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 flex justify-center">
            <div className="relative w-full ">
              <Input
                id="search"
                placeholder="Szukaj wydarzeń..."
                className="pl-10 "
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex gap-4">
            <Select>
              <SelectTrigger id="category" className="min-w-48">
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
            className="flex items-center gap-1 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            Wyczyść
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
