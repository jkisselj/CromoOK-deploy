"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

export const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
        showValues?: boolean
        formatValue?: (value: number) => string
        valuePosition?: "top" | "bottom"
        minDistance?: number
    }
>(({ className, showValues, formatValue, valuePosition = "top", minDistance = 50, ...props }, ref) => {
    const formatDisplayValue = formatValue || ((val: number) => `${val}`);

    const step = props.step || 50;

    const [internalValue, setInternalValue] = React.useState<number[]>(
        Array.isArray(props.value) ? [...props.value] : props.value ? [props.value as number] : [0]
    );

    React.useEffect(() => {
        if (props.value) {
            if (Array.isArray(props.value)) {
                setInternalValue([...props.value]);
            } else {
                setInternalValue([props.value as number]);
            }
        }
    }, [props.value]);

    const handleValueChange = React.useCallback((newValue: number[]) => {
        if (newValue.length > 1) {
            const [min, max] = newValue;

            if (max - min < minDistance) {
                newValue[1] = min + minDistance;
            }
        }

        if (props.onValueChange) {
            props.onValueChange(newValue);
        }

        setInternalValue(newValue);
    }, [props.onValueChange, minDistance]);

    return (
        <div className={cn("relative", className)}>
            {showValues && valuePosition === "top" && (
                <div className="flex w-full justify-between mb-2">
                    {internalValue.map((v, i) => (
                        <span key={i} className="text-sm text-primary-foreground">
                            {formatDisplayValue(v)}
                        </span>
                    ))}
                </div>
            )}
            <SliderPrimitive.Root
                ref={ref}
                className={cn(
                    "relative flex w-full touch-none select-none items-center",
                    className
                )}
                step={step}
                {...props}
                value={internalValue}
                onValueChange={handleValueChange}
            >
                <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                    <SliderPrimitive.Range className="absolute h-full bg-primary" />
                </SliderPrimitive.Track>
                {internalValue.map((_, i) => (
                    <SliderPrimitive.Thumb
                        key={i}
                        className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:cursor-grab active:cursor-grabbing"
                    />
                ))}
            </SliderPrimitive.Root>
            {showValues && valuePosition === "bottom" && (
                <div className="flex w-full justify-between mt-2">
                    {internalValue.map((v, i) => (
                        <span key={i} className="text-sm text-primary-foreground">
                            {formatDisplayValue(v)}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
})

Slider.displayName = "Slider"

export default function Example() {
    const [minPrice] = React.useState(0);
    const [maxPrice] = React.useState(10000);

    return (
        <Slider
            value={[minPrice, maxPrice]}
            min={0}
            max={10000}
            step={50}
            minDistance={50}
            onValueChange={() => { }}
        />
    );
}