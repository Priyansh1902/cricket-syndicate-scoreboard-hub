
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface TextFormFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
}

export const TextFormField = ({ control, name, label, placeholder }: TextFormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              placeholder={placeholder} 
              {...field} 
              className="cricket-input"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
