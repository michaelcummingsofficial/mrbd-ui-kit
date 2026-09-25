"use client";
import { BookOpen, Download, Glasses, Package } from "lucide-react";
import { GlassesFrame } from "./glasses-frame";
import { InstallCommand } from "./install-command";
import { ReadmeContent } from "./readme-content";

interface DesktopShellProps {
	readmeContent: string;
}

const GITHUB_URL = "https://github.com/michaelcummingsofficial/mrbd-ui-kit";
const INSTALL_URL = "https://facebook.com/fb_viewapp/web_app_deep_link?appName=mrbd-ui-kit&appUrl=https%3A%2F%2Fwww.mrbd.fun";
const NPM_URL = "https://www.npmjs.com/package/mrbd-ui-kit";
const META_DOCS_URL = "https://wearables.developer.meta.com/docs/develop/webapps/design/overview/";

function GitHubIcon({ className, ...props }: { "className"?: string; "aria-hidden"?: "true" }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
			<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
		</svg>
	);
}

/**
 * Desktop landing page wrapping the glasses preview. Shows a header,
 * GitHub link, and the rendered README.md alongside the 600×600 viewport.
 */
export function DesktopShell({ readmeContent }: DesktopShellProps) {
	return (
		<div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-zinc-950 text-zinc-200">
			<a
				href="#main-content"
				className="sr-only z-100 rounded-lg bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
				Skip to content
			</a>
			<div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.12)_0%,transparent_60%),radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(139,92,246,0.06)_0%,transparent_50%)]" />

			<aside
				aria-label="Deprecation notice"
				className="relative z-1 border-b border-amber-400/20 bg-amber-400/10 px-6 py-2.5 text-center text-sm text-amber-100">
				mrbd-ui-kit is deprecated. Meta now ships the official toolkit.{" "}
				<a
					href={META_DOCS_URL}
					target="_blank"
					rel="noopener noreferrer"
					className="font-semibold text-amber-300 underline underline-offset-2 hover:text-amber-200">
					Read the docs
				</a>
			</aside>

			<nav aria-label="Main navigation" className="sticky top-0 z-50 border-b border-white/6 bg-zinc-950/70 backdrop-blur-xl backdrop-saturate-[1.8]">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
					<a href="/" aria-label="mrbd-ui-kit home" className="flex items-center gap-2.5 text-inherit no-underline">
						<div className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
							<Glasses className="size-5 text-white" aria-hidden="true" />
						</div>
						<span className="text-base font-bold tracking-tight text-zinc-50">mrbd-ui-kit</span>
					</a>

					<div className="flex items-center gap-1">
						<a
							href="#docs"
							className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.8125rem] font-medium text-zinc-400 no-underline transition-colors hover:bg-white/6 hover:text-zinc-50">
							<BookOpen className="size-4" aria-hidden="true" />
							<span>Docs</span>
						</a>
						<a
							href={NPM_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.8125rem] font-medium text-zinc-400 no-underline transition-colors hover:bg-white/6 hover:text-zinc-50">
							<Package className="size-4" aria-hidden="true" />
							<span>npm</span>
						</a>
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.8125rem] font-medium text-zinc-400 no-underline transition-colors hover:bg-white/6 hover:text-zinc-50 md:flex">
							<GitHubIcon className="size-4" aria-hidden="true" />
							<span>GitHub</span>
						</a>
					</div>
				</div>
			</nav>

			<main id="main-content">
				<section className="relative z-1 px-6 pt-20 pb-16">
					<div className="mx-auto flex max-w-7xl items-center gap-16 max-lg:flex-col max-lg:text-center">
						<div className="flex min-w-0 flex-1 flex-col gap-6 max-lg:items-center">
							<div className="flex flex-col gap-6 text-center lg:text-left">
								<h1 className="m-0 text-[3.5rem] leading-[1.1] font-extrabold tracking-tight text-zinc-50 max-lg:text-4xl">
									Build beautiful apps for
									<br />
									<span className="bg-linear-to-br from-cyan-400 via-blue-400 to-blue-600 bg-clip-text text-transparent">Meta Ray-Ban Display</span>
								</h1>
								<div className="flex flex-col gap-2">
									<h2 className="m-0 text-2xl font-medium tracking-tight text-zinc-200">A UI kit built for the glasses-first web.</h2>
									<p className="m-0 text-lg leading-relaxed text-balance text-zinc-400">
										Pre-built components, spatial navigation, and display-safe styling. Everything you need to ship your first app.
									</p>
								</div>
							</div>
							<div className="flex">
								<div className="flex flex-col justify-center gap-4 pt-2 lg:items-start">
									<div className="flex flex-row gap-4">
										<a
											href={GITHUB_URL}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 rounded-xl border border-blue-500/50 bg-linear-to-br from-blue-400 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white no-underline transition-all hover:-translate-y-0.5 hover:from-blue-400 hover:to-blue-600">
											<GitHubIcon className="size-4" aria-hidden="true" />
											View on GitHub
										</a>
										<a
											href={INSTALL_URL}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-5 py-2.5 text-sm font-semibold text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-white/8 hover:from-blue-400 hover:to-blue-600">
											<Download className="size-4" aria-hidden="true" />
											Add to Glasses
										</a>
									</div>
									<InstallCommand />
								</div>
							</div>
						</div>

						<div className="hidden lg:block">
							<GlassesFrame />
						</div>
					</div>
				</section>

				<section id="docs" className="relative z-1 border-t border-white/4 px-6 pt-16 pb-24">
					<div className="mx-auto max-w-3xl">
						<div className="mb-10 flex items-center gap-3">
							<BookOpen className="size-6 text-blue-400" aria-hidden="true" />
							<h2 className="m-0 text-2xl font-bold text-zinc-50">Documentation</h2>
						</div>
						<ReadmeContent content={readmeContent} />
					</div>
				</section>
			</main>

			<footer className="relative z-1 border-t border-white/4 px-6 py-6">
				<nav aria-label="Footer" className="mx-auto flex max-w-7xl items-center justify-center gap-3 text-[0.8125rem] text-zinc-600">
					<span>MIT License</span>
					<span>·</span>
					<a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-zinc-500 no-underline transition-colors hover:text-zinc-400">
						GitHub
					</a>
					<span>·</span>
					<a href={NPM_URL} target="_blank" rel="noopener noreferrer" className="text-zinc-500 no-underline transition-colors hover:text-zinc-400">
						npm
					</a>
				</nav>
			</footer>
		</div>
	);
}
