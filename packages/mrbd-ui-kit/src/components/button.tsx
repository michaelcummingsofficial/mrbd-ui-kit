import type { ComponentType, ReactNode } from "react";
import { cn } from "../lib/cn";
import { Focusable } from "./focusable";
import { Slot } from "./slot";

export interface ButtonProps {
	children: ReactNode;
	/** @default 'secondary' */
	variant?: "primary" | "secondary" | "ghost" | "glow" | "danger";
	/** @default 'md' */
	size?: "sm" | "md" | "lg";
	/** Registers the button with the focus engine. Must be unique within the `<DisplayRoot>`. */
	id: string;
	icon?: ComponentType<{ className?: string }>;
	/** When false, skip this button for initial auto-focus.
	 * @default true */
	autoFocus?: boolean;
	/** @default false */
	disabled?: boolean;
	/** Called on select (Enter key) */
	onClick?: () => void;
	onFocus?: () => void;
	onBlur?: () => void;
	/** Called when select (Enter) is pressed while focused (alias for onClick) */
	onSelect?: () => void;
	className?: string;
	/**
	 * Merge button styles onto the child element instead of rendering a <button>.
	 * Useful for `<Link>`, `<a>`, or any other element that should act as the
	 * interactive target while still participating in the MRBD focus engine.
	 *
	 * The child must be a single valid React element.
	 *
	 * @example
	 * <Button id="home" asChild>
	 *   <Link href="/home">Home</Link>
	 * </Button>
	 */
	asChild?: boolean;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
	primary: "bg-mrbd-accent/90 text-mrbd-on-accent",
	secondary:
		"border-mrbd-border hover:border-mrbd-border-targeted group-focus:border-mrbd-border-targeted bg-mrbd-surface-2 text-mrbd-text border-t-2 border-l-2",
	ghost: "text-mrbd-text group-focus:bg-mrbd-surface-2 bg-transparent",
	glow:
		"mrbd-glow-stroke bg-mrbd-surface-1 text-mrbd-text hover:[--mrbd-glow-stroke-opacity:0.7] hover:[--mrbd-glow-stroke-width:3px] group-focus:[--mrbd-glow-stroke-opacity:0.7] group-focus:[--mrbd-glow-stroke-width:3px]",
	danger: "bg-mrbd-danger/85 text-mrbd-on-accent"
};

const SIZE_CLASSES: Record<NonNullable<ButtonProps["size"]>, string> = {
	sm: "h-12 px-4 text-sm rounded-3xl gap-1.5",
	md: "h-24 px-4 text-base rounded-4xl gap-2",
	lg: "h-28 px-6 text-base rounded-4xl gap-2"
};

const ICON_CLASSES: Record<NonNullable<ButtonProps["size"]>, string> = {
	sm: "size-5",
	md: "size-6",
	lg: "size-7"
};

export function Button({
	children,
	variant = "secondary",
	size = "md",
	id,
	icon: Icon,
	autoFocus,
	disabled,
	onClick,
	onFocus,
	onBlur,
	onSelect,
	className,
	asChild = false
}: ButtonProps) {
	const resolvedClass = cn(
		"box-trim-both box-edge-cap inline-flex items-center justify-center font-semibold transition-all group-focus:scale-103 hover:scale-103 focus:outline-none",
		VARIANT_CLASSES[variant],
		SIZE_CLASSES[size],
		"hover:shadow-mrbd-glow group-focus:shadow-mrbd-glow",
		disabled && "pointer-events-none opacity-40",
		className
	);
	return (
		<Focusable id={id} autoFocus={autoFocus} onSelect={onSelect ?? onClick} onFocus={onFocus} onBlur={onBlur} disabled={disabled} className="group">
			{asChild ? (
				// Slot needs exactly one child, so `icon` is not rendered here.
				<Slot className={resolvedClass}>{children}</Slot>
			) : (
				<button className={resolvedClass}>
					{Icon && <Icon className={ICON_CLASSES[size]} />}
					{children}
				</button>
			)}
		</Focusable>
	);
}
