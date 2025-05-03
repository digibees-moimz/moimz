import React from "react";
import { twMerge } from "tailwind-merge";

interface FilterToggleGroupProps<T extends string> {
  options: readonly T[];
  selected: T;
  onChange: (value: T) => void;
}

export const FilterToggleGroup = <T extends string>({
  options,
  selected,
  onChange,
}: FilterToggleGroupProps<T>) => {
  return (
    <div className="flex gap-2">
      {options.map((option) => {
        const isActive = selected === option;
        const base = "px-2.5 py-1 rounded-full text-sm font-bold transition";
        const active = "bg-[#DDF5F0] text-[#22BD9C]";
        const inactive = "bg-[#E6E6E6] text-[#A6A6A6]";

        return (
          <button
            key={option}
            className={twMerge(base, isActive ? active : inactive)}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};
