import { TitleBox } from '@/src/components';
import EditEventForm from '@/src/components/EditEventForm';
import { EventController } from '@/src/controllers/EventController';

export default async function EditEventPage(props: {
  params: Promise<{ category: string; title: string }>;
}) {
  const { category, title } = await props.params;
  const event = await EventController.getEvent(
    decodeURIComponent(category),
    decodeURIComponent(title)
  );

  if (event) {
    const categoryArray = event.category ? [event.category] : ['Inne'];
    const formattedEvent = {
      ...event,
      category: categoryArray as [string, ...string[]],
    };

    return (
      <div>
        <TitleBox
          action="Edytuj"
          featuredTitle="wydarzenie"
          description="Edytuj wydarzenie, aby umożliwić innym użytkownikom zakup biletów."
          button={false}
        />
        <div className="px-80">
          <EditEventForm {...formattedEvent} />
        </div>
      </div>
    );
  }

  return <div>Event not found</div>;
}
