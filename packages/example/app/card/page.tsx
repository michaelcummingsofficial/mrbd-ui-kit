"use client";
import { Bell, MessageCircle, Wifi } from "lucide-react";
import { Card, Text } from "mrbd-ui-kit";
import { PageHeader } from "../../components/page-header";

export default function CardPage() {
	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<PageHeader title="Card" />

			<Text size="sm" className="text-mrbd-text-muted">
				Basic content container
			</Text>
			<Card>
				<Text weight="semibold">Simple card</Text>
			</Card>

			<Text size="sm" className="text-mrbd-text-muted">
				With icon and description
			</Text>
			<Card>
				<div className="flex flex-row items-center gap-3">
					<div className="bg-mrbd-accent/10 flex size-9 shrink-0 items-center justify-center rounded-full">
						<Bell className="text-mrbd-accent size-5" aria-hidden="true" />
					</div>
					<div className="flex flex-col gap-0.5">
						<Text weight="semibold">New message from Alex</Text>
						<Text size="sm" className="text-mrbd-text-muted">
							Hey, are you free for lunch today?
						</Text>
					</div>
				</div>
			</Card>

			<Text size="sm" className="text-mrbd-text-muted">
				Status panel
			</Text>
			<Card className="flex flex-col gap-1">
				{[
					{ label: "Connection", value: "Connected", icon: Wifi },
					{ label: "Messages", value: "3 unread", icon: MessageCircle },
					{ label: "Battery", value: "82%", icon: null }
				].map(({ label, value, icon: IconComponent }) => (
					<div key={label} className="flex flex-row items-center justify-between">
						<Text size="sm" className="text-mrbd-text-muted">
							{label}
						</Text>
						<div className="flex flex-row items-center gap-1.5">
							{IconComponent && <IconComponent className="text-mrbd-accent size-3.5" aria-hidden="true" />}
							<Text size="sm" weight="semibold">
								{value}
							</Text>
						</div>
					</div>
				))}
			</Card>
		</div>
	);
}
