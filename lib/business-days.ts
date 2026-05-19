export function getNextFifthBusinessDay(year: number, month: number) {
  const date = new Date(Date.UTC(year, month - 1, 1));
  let businessDays = 0;

  while (businessDays < 5) {
    const weekDay = date.getUTCDay();
    if (weekDay !== 0 && weekDay !== 6) {
      businessDays += 1;
      if (businessDays === 5) {
        break;
      }
    }

    date.setUTCDate(date.getUTCDate() + 1);
  }

  return date;
}
