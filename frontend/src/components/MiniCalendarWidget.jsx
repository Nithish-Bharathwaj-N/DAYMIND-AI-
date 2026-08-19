import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { sound } from '../utils/audio';
import { getMonthCalendarData, getTodayShortDate } from '../utils/dateUtils';

export default function MiniCalendarWidget() {
  const todayDate = new Date();
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(todayDate.getDate());

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const { prevMonthDays, currentMonthDays, nextMonthDays, monthName } = getMonthCalendarData(currentYear, currentMonth);

  const isCurrentRealMonth = todayDate.getFullYear() === currentYear && todayDate.getMonth() === currentMonth;

  const handlePrevMonth = () => {
    sound.playClick();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    sound.playClick();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="ui-card p-5 space-y-4">
      
      {/* Month Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-extrabold text-[var(--text-primary)]">Calendar</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono font-bold text-[var(--text-secondary)] mr-1">
            {fullMonthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-lg hover:bg-slate-500/10 text-slate-400 hover:text-[var(--text-primary)] cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-lg hover:bg-slate-500/10 text-slate-400 hover:text-[var(--text-primary)] cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 text-center text-[10px] font-mono font-bold text-[var(--text-secondary)]">
        {daysOfWeek.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 text-center gap-y-1 text-xs font-semibold">
        
        {/* Prev Month Days */}
        {prevMonthDays.map((d) => (
          <span key={`prev-${d}`} className="text-slate-400/30 p-1.5">{d}</span>
        ))}

        {/* Current Month Days */}
        {currentMonthDays.map((d) => {
          const isToday = isCurrentRealMonth && d === todayDate.getDate();
          const isSelected = selectedDay === d;
          return (
            <button
              key={`curr-${d}`}
              onClick={() => {
                sound.playClick();
                setSelectedDay(d);
              }}
              className={`p-1.5 rounded-full transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30 ring-2 ring-purple-500/50'
                  : isToday
                  ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 font-extrabold ring-1 ring-purple-500'
                  : 'text-[var(--text-primary)] hover:bg-purple-500/10'
              }`}
            >
              {d}
              {isToday && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600" />
              )}
            </button>
          );
        })}

        {/* Next Month Days */}
        {nextMonthDays.map((d) => (
          <span key={`next-${d}`} className="text-slate-400/30 p-1.5">{d}</span>
        ))}

      </div>

    </div>
  );
}
