import { AddEventForm, TitleBox } from '@/src/components';
import { verifySession } from '@/src/server/db/dal';
import { redirect } from 'next/navigation';

export default async function AddEventPage() {
  const session = await verifySession();
  if (!session) {
    redirect('/login');
  }

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
