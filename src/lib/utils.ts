import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatPercent(value: number) {
    return new Intl.NumberFormat("en-US", {
        style: "percent",
        maximumFractionDigits: 2,
    }).format(value / 100);
}
