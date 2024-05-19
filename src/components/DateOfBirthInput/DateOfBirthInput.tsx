import React, { useState, useEffect } from 'react';
import './DateOfBirthInput.css'

interface UniversalInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (newValue: number) => void;
}

const UniversalInput: React.FC<UniversalInputProps> = ({ label, value, min, max, onChange }) => {
  const options = [];
  for (let i = min; i <= max; i++) {
    options.push(<option key={i} value={i}>{i}</option>);
  }

  return (
    <div className="flex flex-col items-center  rounded-lg p-4 bg-white shadow-lg">
      <label className="label text-lg font-semibold text-gray-800 mb-2">{label}</label>
      <div className="flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="custom-select  text-center mx-2 w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-950"
        >
          {options}
        </select>
      </div>
    </div>
  );
};




interface DateOfBirthInputProps {
  onDateChange: (newDate: { day: number; month: number; year: number }) => void;
}

const DateOfBirthInput: React.FC<DateOfBirthInputProps> = ({ onDateChange }) => {
  const currentYear: number = new Date().getFullYear();

  const [day, setDay] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(currentYear);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  useEffect(() => {
    const days = getDaysInMonth(month, year);
    setDaysInMonth(days);
    if (day > days.length) {
      setDay(1);
      onDateChange({ day: 1, month, year });
    }
  }, [month, year]);

  const getDaysInMonth = (m: number, y: number): number[] => {
    const date = new Date(y, m, 0);
    return Array.from({ length: date.getDate() }, (_, i) => i + 1);
  };

  const handleDayChange = (newDay: number) => {
    setDay(newDay);
    onDateChange({ day: newDay, month, year });
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    const newDaysInMonth = getDaysInMonth(newMonth, year);
    setDaysInMonth(newDaysInMonth);
    if (day > newDaysInMonth.length) {
      setDay(1);
      onDateChange({ day: 1, month: newMonth, year });
    } else {
      onDateChange({ day, month: newMonth, year });
    }
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    const newDaysInMonth = getDaysInMonth(month, newYear);
    setDaysInMonth(newDaysInMonth);
    if (day > newDaysInMonth.length) {
      setDay(1);
      onDateChange({ day: 1, month, year: newYear });
    } else {
      onDateChange({ day, month, year: newYear });
    }
  };

  return (
    <div className="flex gap-8 justify-between items-center border border-blue-800 p-8 bg-blue-700 rounded-lg">
      <UniversalInput
        label="Day"
        value={day}
        min={1}
        max={daysInMonth.length}
        onChange={handleDayChange}
      />
      <UniversalInput
        label="Month"
        value={month}
        min={1}
        max={12}
        onChange={handleMonthChange}
      />
      <UniversalInput
        label="Year"
        value={year}
        min={1900}
        max={currentYear}
        onChange={handleYearChange}
      />
    </div>
  );
};

export default DateOfBirthInput;