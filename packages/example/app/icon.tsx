import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "linear-gradient(135deg, #60a5fa, #2563eb)",
				borderRadius: "50%"
			}}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="40"
				height="40"
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
		</div>,
		{ ...size }
	);
}
