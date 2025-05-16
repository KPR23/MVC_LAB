'use client';
import { AddEventForm, TitleBox } from '@/src/components';

export default function AddEventPage() {
  return (
    <div>
      <TitleBox
        action="Dodaj"
        featuredTitle="wydarzenie"
        description="Dodaj nowe wydarzenie, aby umożliwić innym użytkownikom zakup biletów."
        button={false}
      />
      <div className="px-80">
        <AddEventForm />
      </div>
    </div>
  );
}
