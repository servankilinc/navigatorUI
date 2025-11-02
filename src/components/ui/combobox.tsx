'use client';
import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export class selectItem {
  label: string;
  value: string;
  searchParam: string;
  constructor(label: string, value: string, searchParam: string) {
    this.label = label;
    this.value = value;
    this.searchParam = searchParam;
  }
}

type comboboxProps = {
  selectItems: selectItem[];
  placeholder: string | undefined;
  selectedValue: string | undefined;
  setSelectedValue: (value: string | undefined) => void;
  width?: number | undefined;
};

export default function Combobox(props: comboboxProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild >
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {props.selectedValue ? props.selectItems.find((item) => item.value === props.selectedValue)?.label : props.placeholder ?? 'Seçiniz'}
          <ChevronsUpDown className="opacity-25" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={(props.width ? `w-[${props.width}px]` : '')}>
        <Command>
          <CommandInput placeholder={props.placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>Sonuç Bulunamadı.</CommandEmpty>
            <CommandGroup>
              {props.selectItems.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.searchParam}
                  onSelect={(currentValue) => {
                    let selectedSearchParam = props.selectItems.find(f => f.searchParam == currentValue);
                    props.setSelectedValue(selectedSearchParam?.value === props.selectedValue ? undefined : selectedSearchParam?.value);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check className={cn('ml-auto', props.selectedValue === item.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
