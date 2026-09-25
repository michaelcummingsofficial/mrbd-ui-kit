"use client";
import { ArrowLeft } from "lucide-react";
import { Button, Text } from "mrbd-ui-kit";
import Link from "next/link";

interface PageHeaderProps {
	title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
	return (
		<div className="flex flex-row items-center gap-3">
			<Button id="back" size="sm" variant="ghost" autoFocus={false} asChild>
				<Link href="/" aria-label="Back to home">
					<ArrowLeft className="size-4" aria-hidden="true" />
				</Link>
			</Button>
			<Text size="lg" weight="bold">
				{title}
			</Text>
		</div>
	);
}
