export function getEventDateInfo(event: { dateFrom: string; dateTo: string }) {
  const dateFrom = new Date(event.dateFrom);
  const dateTo = new Date(event.dateTo);
  let dayName = dateFrom.toLocaleDateString('pl-PL', { weekday: 'short' });
  if (dayName.endsWith('.')) {
    dayName = dayName.slice(0, -1);
  }
  const formattedDateFrom = dateFrom.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
  });
  const formattedDateTo = dateTo.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedDateFromWithYear = dateFrom.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const daysDifference = Math.ceil(
    (dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)
  );

  const displayDayName = capitalizeFirstLetter(dayName);
  const eventDates = Array.from({ length: daysDifference + 1 }, (_, i) => {
    const currentDate = new Date(dateFrom);
    currentDate.setDate(dateFrom.getDate() + i);
    return currentDate;
  });

  return {
    dateFrom,
    dateTo,
    dayName,
    displayDayName,
    formattedDateFrom,
    formattedDateTo,
    formattedDateFromWithYear,
    daysDifference,
    eventDates,
  };
}

export function capitalizeFirstLetter(word: string) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function createSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
