import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { getValue } from "@/helpers/init";
import { cn } from "@/lib/utils";
import type { Lists, Option } from "@/types/init";
import { Check, ChevronDownIcon, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

export function FormDatePicker({
   label,
   name,
   errors,
   onChange,
   value,
}: Readonly<{ errors: Lists; name: string; label?: string; onChange?: (value: Date | string | undefined) => void; value?: string }>) {
   const id = v4();

   const [open, setOpen] = useState(false);
   const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);

   useEffect(() => {
      setDate(value ? new Date(value) : undefined);
   }, [value]);

   return (
      <div className="grid w-full items-center gap-1 flex-1">
         <Label htmlFor={id}>{label}</Label>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button variant="outline" id={id} className={cn("w-full justify-between font-normal", errors?.[name] ? "border border-red-500" : "")}>
                  {date ? date.toLocaleDateString() : <span className="opacity-80 font-light">Pilih tanggal</span>}
                  <ChevronDownIcon />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
               <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                     setDate(date);
                     setOpen(false);
                     onChange?.(date);
                  }}
               />
            </PopoverContent>
         </Popover>
         {errors?.[name] && <p className="text-red-500 text-xs mt-[0.5]">{errors?.[name]}</p>}
      </div>
   );
}

export function FormCommand({
   name,
   label,
   value,
   options,
   onSearch,
   onChange,
   errors,
   isLoading,
   disabled = false,
}: Readonly<{
   name: string;
   label?: string;
   value?: string;
   options?: Array<Option>;
   onSearch?: (value: string) => void;
   onChange?: (value: string) => void;
   errors?: Lists;
   isLoading?: boolean;
   disabled?: boolean;
}>) {
   const [open, setOpen] = React.useState(false);
   const [valueProps, setValueProps] = React.useState(value);

   const id = v4();

   const selectedOption: Option | undefined = options?.find((item) => item.value.toString() === String(valueProps || value));

   return (
      <div className="grid w-full items-center gap-1 flex-1">
         <Label htmlFor={id}>{label}</Label>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  disabled={disabled}
                  id={id}
                  variant="outline"
                  className={cn(
                     "border-input text-popover-foreground justify-between w-full h-9 rounded-md border inline-center",
                     errors?.[name] ? "border border-red-500" : ""
                  )}>
                  {valueProps || value ? (
                     selectedOption?.label ?? label
                  ) : (
                     <span data-slot="select-value" style={{ pointerEvents: "none" }} className="opacity-80 font-light">
                        {label}
                     </span>
                  )}
                  <ChevronsUpDown className="opacity-50" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
               <Command>
                  <CommandInput
                     placeholder={`Cari ${label}`}
                     className="h-8"
                     onValueChange={(value) => {
                        setValueProps(value);
                        onSearch?.(value);
                     }}
                  />
                  <CommandList>
                     <CommandEmpty>
                        {isLoading ? (
                           <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                              <span>Loading...</span>
                           </div>
                        ) : (
                           <div>Tidak ada daftar yang ditemukan.</div>
                        )}
                     </CommandEmpty>
                     <CommandGroup>
                        {options?.map((item) => {
                           return (
                              <CommandItem
                                 key={item.value}
                                 value={item.label}
                                 onSelect={() => {
                                    setValueProps(item.value);
                                    setOpen(false);
                                    onChange?.(item.value);
                                 }}>
                                 {item.label}
                                 <Check className={cn("ml-auto", value === item.value ? "opacity-100" : "opacity-0")} />
                              </CommandItem>
                           );
                        })}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
         {errors?.[name] && <p className="text-red-500 text-xs mt-[0.5]">{errors?.[name]}</p>}
      </div>
   );
}

export function FormText({
   label,
   value,
   onChange,
   name,
   errors,
   className,
}: Readonly<{
   label?: string;
   value?: string;
   onChange?: (value: string) => void;
   errors?: Lists;
   name: string;
   className?: string;
}>) {
   const id = v4();

   return (
      <div className="grid w-full items-center gap-1 flex-1">
         <Label htmlFor={id}>{label}</Label>
         <Input
            type="text"
            id={id}
            placeholder={label}
            value={value || ""}
            onChange={({ target: { value } }) => onChange?.(value)}
            name={name}
            className={cn(errors?.[name] && "border border-red-500", className)}
         />
         {errors?.[name] && <p className="text-red-500 text-xs mt-[0.5]">{errors?.[name]}</p>}
      </div>
   );
}

export function FormSelect({
   label,
   options = [],
   value,
   onValueChange,
   name,
   errors,
   disabled = false,
}: Readonly<{
   name: string;
   errors?: Lists;
   label?: string;
   options: Array<Lists>;
   value?: string;
   onValueChange?: (value: string) => void;
   disabled?: boolean;
}>) {
   const id = v4();

   return (
      <div className="grid w-full items-center gap-1 flex-1">
         <Label htmlFor={id}>{label}</Label>
         <Select key={value} value={value || ""} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className={cn(errors?.[name] && "border border-red-500", "w-full")}>
               <SelectValue placeholder={`Pilih ${label}`} />
            </SelectTrigger>
            <SelectContent>
               {options?.map((row) => (
                  <SelectItem key={getValue(row, "value")} value={getValue(row, "value")}>
                     {getValue(row, "label")}
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>
         {errors?.[name] && <p className="text-red-500 text-xs mt-[0.5]">{errors?.[name]}</p>}
      </div>
   );
}

export function FormTextarea({
   label,
   value,
   onChange,
   name,
   errors,
   className,
}: Readonly<{ label?: string; value?: string; onChange?: (value: string) => void; name: string; errors?: Lists; className?: string }>) {
   const id = v4();

   return (
      <div className="grid w-full items-center gap-1 flex-1">
         <Label htmlFor={id}>{label}</Label>
         <Textarea
            id={id}
            placeholder={label}
            value={value || ""}
            onChange={({ target: { value } }) => onChange?.(value)}
            name={name}
            className={cn(errors?.[name] && "border border-red-500", className)}
         />
         {errors?.[name] && <p className="text-red-500 text-xs mt-[0.5]">{errors?.[name]}</p>}
      </div>
   );
}
