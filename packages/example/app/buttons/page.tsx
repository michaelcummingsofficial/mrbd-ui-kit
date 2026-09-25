"use client";
import { Check, Sparkles, Star, Trash2, X } from "lucide-react";
import { Button, Text } from "mrbd-ui-kit";
import { PageHeader } from "../../components/page-header";

export default function ButtonsPage() {
	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<PageHeader title="Buttons" />

			<div className="flex flex-col gap-2">
				<Text size="sm" className="text-mrbd-text-muted">
					Variants
				</Text>
				<div className="flex flex-row flex-wrap gap-2">
					<Button id="btn-primary" variant="primary" size="sm" icon={Check}>
						Primary
					</Button>
					<Button id="btn-secondary" variant="secondary" size="sm" icon={Star}>
						Secondary
					</Button>
					<Button id="btn-ghost" variant="ghost" size="sm" icon={X}>
						Ghost
					</Button>
					<Button id="btn-glow" variant="glow" size="sm" icon={Sparkles}>
						Glow
					</Button>
					<Button id="btn-danger" variant="danger" size="sm" icon={Trash2}>
						Danger
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Text size="sm" className="text-mrbd-text-muted">
					Sizes
				</Text>
				<div className="flex flex-row items-center gap-2">
					<Button id="btn-sm" variant="primary" size="sm" className="w-32">
						Small
					</Button>
					<Button id="btn-md" variant="primary" size="md" className="w-32">
						Medium
					</Button>
					<Button id="btn-lg" variant="primary" size="lg" className="w-32">
						Large
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Text size="sm" className="text-mrbd-text-muted">
					States
				</Text>
				<div className="flex flex-row gap-2">
					<Button id="btn-disabled" variant="primary" size="sm" disabled>
						Disabled
					</Button>
				</div>
			</div>
		</div>
	);
}
