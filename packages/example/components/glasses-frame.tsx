"use client";

/**
 * Decorative frame that wraps a 600×600 iframe preview on desktop.
 * Shows the app in an isolated iframe with a glow effect and status label.
 */
export function GlassesFrame() {
	return (
		<div className="relative p-6">
			<div className="pointer-events-none absolute -inset-8 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)]" />

			{/* An iframe keeps the demo's navigation from moving the marketing page. */}
			<div className="relative overflow-hidden rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_60px_rgba(59,130,246,0.1),0_25px_50px_rgba(0,0,0,0.5)]">
				<iframe src="/" className="block size-150 border-0" title="MRBD App Preview" />
			</div>

			<div className="mt-3 flex items-center justify-center gap-2 text-[0.6875rem] font-medium tracking-widest text-zinc-600 uppercase">
				Use arrow keys to navigate and enter to select
			</div>
		</div>
	);
}
