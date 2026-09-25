import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface SlotProps extends HTMLAttributes<HTMLElement> {
	children: ReactNode;
}

/**
 * Merges its own props (className, style, event handlers, etc.) onto its
 * single child element — the child's own props take precedence for conflicts,
 * except `className` which is concatenated.
 *
 * Inspired by Radix UI's `Slot` primitive.
 *
 * @example
 * <Slot className="btn-styles">
 *   <Link href="/home">Home</Link>
 * </Slot>
 * // Renders: <a href="/home" class="btn-styles">Home</a>
 */
export function Slot({ children, className, ...slotProps }: SlotProps) {
	const child = Children.only(children);
	if (!isValidElement(child)) {
		throw new Error("<Slot> requires a single valid React element as its child.");
	}

	// Cast to an open props shape so cloneElement accepts arbitrary prop names
	// (isValidElement narrows to ReactElement<unknown> which makes props opaque).
	const typedChild = child as ReactElement<Record<string, unknown>>;
	const childProps = typedChild.props;
	return cloneElement(typedChild, {
		...slotProps,
		...childProps,
		className: cn(className, childProps.className as string | undefined)
	});
}
