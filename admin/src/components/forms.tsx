import { getValue } from "@/helpers/init";
import { cn } from "@/lib/utils";
import type { Lists } from "@/types/init";
import { v4 } from "uuid";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

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
            value={value}
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
         <Select value={value} onValueChange={onValueChange}>
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
            value={value}
            onChange={onChange}
            name={name}
            className={cn(errors?.[name] && "border border-red-500")}
         />
         {errors?.[name] && <p className="text-red-500 text-xs mt-[0.5]">{errors?.[name]}</p>}
      </div>
   );
}
