"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "@/hooks/use-toast";

// Zod schema for validation
const reviewFormSchema = z.object({
    manuscriptId: z.string().min(1, "Manuscript ID is required"),
    overallRating: z.enum(["1", "2", "3", "4", "5"], {
        required_error: "You need to select an overall rating.",
    }),
    novelty: z.enum(["1", "2", "3", "4", "5"], {
        required_error: "You need to rate the novelty.",
    }),
    technicalQuality: z.enum(["1", "2", "3", "4", "5"], {
        required_error: "You need to rate the technical quality.",
    }),
    clarity: z.enum(["1", "2", "3", "4", "5"], {
        required_error: "You need to rate the clarity.",
    }),
    significance: z.enum(["1", "2", "3", "4", "5"], {
        required_error: "You need to rate the significance.",
    }),
    recommendation: z.enum(["accept", "minor_revision", "major_revision", "reject"], {
        required_error: "You need to provide a recommendation.",
    }),
    commentsToAuthor: z.string().min(1, "Comments to the author are required"),
    commentsToEditor: z.string().optional(),
});

// Reusable RatingRadioGroup component
const RatingRadioGroup = ({ field, label, description }: { field: any; label: string; description: string }) => (
    <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
            <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex justify-between space-x-2"
            >
                {[1, 2, 3, 4, 5].map((value) => (
                    <FormItem key={value} className="relative">
                        <FormControl>
                            <RadioGroupItem value={value.toString()} id={`${label.toLowerCase()}-${value}`} className="sr-only" />
                        </FormControl>
                        <label
                            htmlFor={`${label.toLowerCase()}-${value}`}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-sm font-medium hover:border-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${field.value === value.toString() ? "bg-primary text-white" : "bg-white text-gray-700"
                                }`}
                        >
                            {value}
                        </label>
                    </FormItem>
                ))}
            </RadioGroup>
        </FormControl>
        <FormDescription>{description}</FormDescription>
        <FormMessage />
    </FormItem>
);

export default function ReviewSubmissionForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof reviewFormSchema>>({
        resolver: zodResolver(reviewFormSchema),
        defaultValues: {
            manuscriptId: "",
            overallRating: undefined,
            novelty: undefined,
            technicalQuality: undefined,
            clarity: undefined,
            significance: undefined,
            recommendation: undefined,
            commentsToAuthor: "",
            commentsToEditor: "",
        },
    });

    function onSubmit(data: z.infer<typeof reviewFormSchema>) {
        setIsSubmitting(true);
        console.log(data); // Send data to backend
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Review submitted",
                description: "Your review has been successfully submitted.",
            });
            form.reset();
        }, 2000);
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Submit Manuscript Review</CardTitle>
                <CardDescription>Please provide your evaluation and comments for the manuscript you have reviewed.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="manuscriptId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manuscript ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter the manuscript ID" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="overallRating"
                            render={({ field }) => (
                                <RatingRadioGroup
                                    field={field}
                                    label="Overall Rating"
                                    description="Rate the manuscript from 1 (poor) to 5 (excellent)."
                                />
                            )}
                        />
                        {["novelty", "technicalQuality", "clarity", "significance"].map((criterion) => (
                            <FormField
                                key={criterion}
                                control={form.control}
                                name={criterion as "novelty" | "technicalQuality" | "clarity" | "significance"}
                                render={({ field }) => (
                                    <RatingRadioGroup
                                        field={field}
                                        label={criterion
                                            .charAt(0)
                                            .toUpperCase() + criterion.slice(1).replace(/([A-Z])/g, " $1")}
                                        description={`Rate the ${criterion.toLowerCase()} from 1 (poor) to 5 (excellent).`}
                                    />
                                )}
                            />
                        ))}
                        <FormField
                            control={form.control}
                            name="recommendation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recommendation</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your recommendation" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="accept">Accept</SelectItem>
                                            <SelectItem value="minor_revision">Minor Revision</SelectItem>
                                            <SelectItem value="major_revision">Major Revision</SelectItem>
                                            <SelectItem value="reject">Reject</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="commentsToAuthor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comments to Author</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Provide your detailed comments and feedback for the author"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="commentsToEditor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comments to Editor (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Provide any confidential comments for the editor"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
