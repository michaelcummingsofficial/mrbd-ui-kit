import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface CardProps {
	children: ReactNode;
	className?: string;
}

export function Card({ children, className }: CardProps) {
	return <div className={cn("border-mrbd-border bg-mrbd-surface-2 rounded-3xl border-t-2 border-l-2 p-3", className)}>{children}</div>;
}
