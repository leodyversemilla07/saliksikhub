import { FormControl, FormItem, FormLabel } from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface RatingRadioGroupProps {
    field: any;
    label: string;
    description: string;
}

export function RatingRadioGroup({ field, label, description }: RatingRadioGroupProps) {
    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <RadioGroup
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                    className="flex gap-4"
                >
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <FormItem key={rating} className="flex items-center space-x-2">
                            <FormControl>
                                <RadioGroupItem value={rating.toString()} />
                            </FormControl>
                            <FormLabel className="font-normal">{rating}</FormLabel>
                        </FormItem>
                    ))}
                </RadioGroup>
            </FormControl>
        </FormItem>
    );
}