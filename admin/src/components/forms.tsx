import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { getValue } from "@/helpers/init";
import { cn } from "@/lib/utils";
import type { Lists, Option } from "@/types/init";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";
import { v4 } from "uuid";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

export function FormCommand({
   name,
   label,
   value,
   options,
   onSearch,
   onChange,
   errors,
   isLoading,
}: Readonly<{
   name: string;
   label?: string;
   value?: string;
   options?: Array<Option>;
   onSearch?: (value: string) => void;
   onChange?: (value: string) => void;
   errors?: Lists;
   isLoading?: boolean;
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
}: Readonly<{
   label?: string;
   value?: string;
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
   errors?: Lists;
   name: string;
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
            onChange={onChange}
            name={name}
            className={cn(errors?.[name] && "border border-red-500")}
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
}: Readonly<{ name: string; errors?: Lists; label?: string; options: Array<Lists>; value?: string; onValueChange?: (value: string) => void }>) {
   const id = v4();

   return (
      <div className="grid w-full items-center gap-1 flex-1">
         <Label htmlFor={id}>{label}</Label>
         <Select key={value} value={value || ""} onValueChange={onValueChange}>
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
}: Readonly<{ label?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; name: string; errors?: Lists }>) {
   const id = v4();

   return (
      <div className="grid w-full items-center gap-1 flex-1">
         <Label htmlFor={id}>{label}</Label>
         <Textarea
            id={id}
            placeholder={label}
            value={value || ""}
            onChange={onChange}
            name={name}
            className={cn(errors?.[name] && "border border-red-500")}
         />
         {errors?.[name] && <p className="text-red-500 text-xs mt-[0.5]">{errors?.[name]}</p>}
      </div>
   );
}
