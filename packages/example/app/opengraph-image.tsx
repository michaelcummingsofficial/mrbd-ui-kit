import { ImageResponse } from "next/og";

export const alt = "mrbd-ui-kit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: "32px",
				background: "#000"
			}}>
			<div
				style={{
					width: "120px",
					height: "120px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "linear-gradient(135deg, #60a5fa, #2563eb)",
					borderRadius: "50%"
				}}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="72"
					height="72"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round">
					<circle cx="6" cy="15" r="4" />
					<circle cx="18" cy="15" r="4" />
					<path d="M14 15a2 2 0 0 0-4 0" />
					<path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2" />
					<path d="M21.5 13 19 7c-.7-1.3-1.4-2-3-2" />
				</svg>
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "12px"
				}}>
				<span
					style={{
						fontSize: "56px",
						fontWeight: 700,
						color: "rgba(255, 255, 255, 0.92)",
						letterSpacing: "-0.02em"
					}}>
					mrbd-ui-kit
				</span>
				<span
					style={{
						fontSize: "24px",
						fontWeight: 500,
						color: "rgba(255, 255, 255, 0.5)"
					}}>
					The easiest way to build an app for Meta Ray-Ban Display
				</span>
			</div>
		</div>,
		{ ...size }
	);
}
