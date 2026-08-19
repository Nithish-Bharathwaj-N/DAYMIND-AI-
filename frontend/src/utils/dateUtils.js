// Helper functions for dynamic local Date & Time

export function getTodayFormatted() {
  const now = new Date();
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  return now.toLocaleDateString('en-US', options); // e.g. "Wednesday, Aug 19, 2026"
}

export function getTodayShortDate() {
  const now = new Date();
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return now.toLocaleDateString('en-US', options); // e.g. "Aug 19, 2026"
}

export function getCurrentDayName() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

export function getCurrentMonthName() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[new Date().getMonth()];
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getMonthCalendarData(year, month) {
  // month: 0-indexed (0 = Jan, 7 = Aug)
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const adjustedFirstDay = (firstDayIndex + 6) % 7; // 0 = Mon
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const prevMonthDays = [];
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthTotalDays - i);
  }

  const currentMonthDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  const totalGridCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalGridCells % 7 === 0 ? 0 : 7 - (totalGridCells % 7);
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

  return {
    prevMonthDays,
    currentMonthDays,
    nextMonthDays,
    monthName: getCurrentMonthName(),
    year,
    todayDateNum: new Date().getDate()
  };
}
