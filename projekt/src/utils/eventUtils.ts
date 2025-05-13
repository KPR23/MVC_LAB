export function getEventDateInfo(event: {
  dateFrom: string;
  dateTo: string;
  price: number;
}) {
  const dateFrom = new Date(event.dateFrom);
  const dateTo = new Date(event.dateTo);

  const shortMonthWithoutYear = dateFrom.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
  });

  const shortMonthWithYear = dateTo.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const fullMonthWithoutYear = dateFrom.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'long',
  });

  const fullMonthWithYear = dateTo.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  let shortDayName = dateFrom.toLocaleDateString('pl-PL', { weekday: 'short' });
  let fullDayName = dateFrom.toLocaleDateString('pl-PL', { weekday: 'long' });

  if (shortDayName.endsWith('.')) {
    shortDayName = shortDayName.slice(0, -1);
  }

  const daysDifference = Math.ceil(
    (dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)
  );

  const capitalizedShortDayName = capitalizeFirstLetter(shortDayName);

  const eventDates = Array.from({ length: daysDifference + 1 }, (_, i) => {
    const currentDate = new Date(dateFrom);
    currentDate.setDate(dateFrom.getDate() + i);
    return currentDate;
  });

  const priceInPLN = event.price / 100;

  return {
    dateFrom,
    dateTo,
    shortMonthWithoutYear,
    shortMonthWithYear,
    fullMonthWithYear,
    fullMonthWithoutYear,
    shortDayName,
    fullDayName,
    capitalizedShortDayName,
    daysDifference,
    eventDates,
    priceInPLN,
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
