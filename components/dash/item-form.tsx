"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type UnitEnum, UNIT_OPTIONS } from "@/lib/types/pantrytypes";
import { CATEGORY_OPTIONS } from "@/lib/types/shoppingtypes";
import { type CategoryEnum } from "@/lib/types/pantrytypes";

type Props = {
  quantity: number;
  unit: UnitEnum | undefined;
  category: CategoryEnum;
  name: string;
  onQuantityChange: (v: number) => void;
  onUnitChange: (v: UnitEnum | undefined) => void;
  onCategoryChange: (v: CategoryEnum) => void;
  onNameChange: (v: string) => void;
  onSubmit?: () => void;
};

const UNIT_NONE_VALUE = "__none__";

function groupUnits() {
  const map = new Map<string, { value: UnitEnum; label: string; group: string }[]>();
  for (const unit of UNIT_OPTIONS) {
    const list = map.get(unit.group) ?? [];
    list.push(unit);
    map.set(unit.group, list);
  }
  return Array.from(map.entries());
}

const UNIT_GROUPS = groupUnits();

export function ItemForm({
  quantity,
  unit,
  category,
  name,
  onQuantityChange,
  onUnitChange,
  onCategoryChange,
  onNameChange,
  onSubmit,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 items-end w-full">
      <div className="col-span-3 flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground" htmlFor="shopping-item-name">
          Item name
        </Label>
        <Input
          id="shopping-item-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder='e.g. "Orange juice"'
          className="h-9"
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSubmit) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label
          className="text-xs text-muted-foreground"
          htmlFor="shopping-item-quantity"
        >
          Quantity
        </Label>
        <Input
          id="shopping-item-quantity"
          type="number"
          min={0.1}
          step={0.1}
          value={Number.isFinite(quantity) ? String(quantity) : "1"}
          onChange={(e) => {
            const next = Number.parseFloat(e.target.value);
            onQuantityChange(Number.isFinite(next) && next > 0 ? next : 1);
          }}
          className="h-9"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground" htmlFor="shopping-item-unit">
          Unit
        </Label>
        <Select
          value={unit ?? UNIT_NONE_VALUE}
          onValueChange={(value) =>
            onUnitChange(value === UNIT_NONE_VALUE ? undefined : (value as UnitEnum))
          }
        >
          <SelectTrigger id="shopping-item-unit" className="h-9 w-full">
            <SelectValue placeholder="— none —" />
          </SelectTrigger>
          <SelectContent align="start" position="popper" side="bottom">
            <SelectItem value={UNIT_NONE_VALUE}>— none —</SelectItem>
            <SelectSeparator />
            {UNIT_GROUPS.map(([group, options], index) => (
              <React.Fragment key={group}>
                <SelectGroup>
                  <SelectLabel>{group}</SelectLabel>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
                {index < UNIT_GROUPS.length - 1 ? <SelectSeparator /> : null}
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label
          className="text-xs text-muted-foreground"
          htmlFor="shopping-item-category"
        >
          Category
        </Label>
        <Select value={category} onValueChange={(value) => onCategoryChange(value)}>
          <SelectTrigger id="shopping-item-category" className="h-9 w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent align="start" position="popper" side="bottom">
            {CATEGORY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.emoji} {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

