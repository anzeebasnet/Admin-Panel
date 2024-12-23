"use client";

import React, { useState, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";

export interface CalendarEventsTypes {
  title: string;
  start: Date;
  end: Date;
}

const localizer = momentLocalizer(moment);

type CalendarView = (typeof Views)[keyof typeof Views];

export default function ResponsiveCalendar({
  events,
}: {
  events: CalendarEventsTypes[];
}) {
  const [date, setDate] = useState(new Date(2024, 8, 15));
  const [view, setView] = useState<CalendarView>(Views.MONTH);

  const onNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  return (
    <div className="sm:w-full w-[90vw] h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <style jsx global>{`
        .rbc-calendar {
          font-family: "Arial", sans-serif;
        }
        .rbc-header {
          background-color: #3abff8;
          color: white;
          padding: 10px;
          font-weight: bold;
        }
        .rbc-today {
          background-color: #bae6fd;
        }
        .rbc-event {
          background-color: #3abff8;
          border: none;
        }
        .rbc-event-content {
          font-size: 14px;
          font-weight: bold;
          color: white;
        }
        .rbc-toolbar button {
          color: #3abff8;
          border-color: #3abff8;
        }
        .rbc-toolbar button:hover,
        .rbc-toolbar button:active,
        .rbc-toolbar button.rbc-active {
          background-color: #3abff8;
          color: white;
        }
        .rbc-off-range-bg {
          background-color: #e0f2fe;
        }
        .rbc-toolbar .rbc-btn-group button {
          font-size: 8px !important; /* Default for smaller screens */
        }

        @media (min-width: 640px) {
          .rbc-toolbar .rbc-btn-group button {
            font-size: 10px !important; /* Larger font size for screens 640px and above */
          }
        }
      `}</style>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={date}
        onNavigate={onNavigate}
        style={{ height: "100%" }}
      />
    </div>
  );
}
