"use client";

import { CornerRightUp, Mic } from "lucide-react";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { useAutoResizeTextarea } from "~/hooks/use-auto-resize-textarea";
import { Textarea } from "./textarea";
import { cn } from "~/lib/utils";

interface AIInputProps {
    id?: string;
    placeholder?: string;
    minHeight?: number;
    maxHeight?: number;
    onSubmit?: (value: string) => void;
    onChange?: (value: string) => void; // Keep this as a function taking a string
    className?: string;
    value?: string;
    disabled?: boolean;
    disableMic?: boolean;
    disableSend?: boolean;
}

export function AIInput({
    id = "ai-input",
    placeholder = "Type your message...",
    minHeight = 52,
    maxHeight = 200,
    onSubmit,
    onChange,
    className,
    value: controlledValue,
    disabled = false,
    disableMic = false,
    disableSend = false
}: AIInputProps) {
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight,
        maxHeight,
    });

    // Use controlled or uncontrolled input based on prop
    const [internalValue, setInternalValue] = useState("");
    const inputValue = controlledValue ?? internalValue;

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        // Update internal state if not controlled
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }

        // Call onChange prop if provided
        onChange?.(newValue);

        // Adjust textarea height
        adjustHeight();
    };

    const handleReset = () => {
        if (disabled || disableSend) return;

        const trimmedValue = inputValue.trim();
        if (!trimmedValue) return;

        onSubmit?.(trimmedValue);

        // Clear value based on controlled/uncontrolled
        if (controlledValue === undefined) {
            setInternalValue("");
        }

        adjustHeight(true);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleReset();
        }
    };

    return (
        <div className={cn("w-full py-4", className)}>
            <div className="relative max-w-xl w-full mx-auto">
                <Textarea
                    id={id}
                    placeholder={placeholder}
                    className={cn(
                        "max-w-xl bg-black/5 dark:bg-white/5 rounded-3xl pl-6 pr-16",
                        "placeholder:text-black/50 dark:placeholder:text-white/50",
                        "border-none ring-black/20 dark:ring-white/20",
                        "text-black dark:text-white text-wrap",
                        "overflow-y-auto resize-none",
                        "focus-visible:ring-0 focus-visible:ring-offset-0",
                        "transition-[height] duration-100 ease-out",
                        "leading-[1.2] py-[16px]",
                        `min-h-[${minHeight}px]`,
                        `max-h-[${maxHeight}px]`,
                        "[&::-webkit-resizer]:hidden",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                />

                {!disableMic && (
                    <div
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1 transition-all duration-200",
                            inputValue ? "right-10" : "right-3",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Mic className="w-4 h-4 text-black/70 dark:text-white/70" />
                    </div>
                )}

                {!disableSend && (
                    <button
                        onClick={handleReset}
                        type="button"
                        disabled={disabled || !inputValue.trim()}
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 right-3",
                            "rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1",
                            "transition-all duration-200",
                            inputValue
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95 pointer-events-none",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <CornerRightUp className="w-4 h-4 text-black/70 dark:text-white/70" />
                    </button>
                )}
            </div>
        </div>
    );
}