"use client";

import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Dayjs } from "dayjs";

interface BasicTimePickerProps {
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
}

export default function BasicTimePicker({
  value,
  onChange,
}: BasicTimePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["TimePicker"]}>
        <TimePicker
          label=""
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              className: "h-12 w-3 text-sm", // Apply Tailwind classes here
              InputProps: {
                className: "h-8 p-2", // Adjust input padding and height
              },
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
