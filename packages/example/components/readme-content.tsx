"use client";
import { Check, Clipboard } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface ReadmeContentProps {
	content: string;
}

/** Language display labels for the code block title bar. */
const LANGUAGE_LABELS: Record<string, string> = {
	tsx: "TSX",
	ts: "TypeScript",
	typescript: "TypeScript",
	jsx: "JSX",
	js: "JavaScript",
	javascript: "JavaScript",
	css: "CSS",
	bash: "Terminal",
	sh: "Terminal",
	shell: "Terminal",
	json: "JSON",
	html: "HTML"
};

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	async function copy() {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<button
			onClick={copy}
			className="flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-200"
			aria-label="Copy code">
			{copied ? <Check className="size-3.5 text-green-400" aria-hidden="true" /> : <Clipboard className="size-3.5" aria-hidden="true" />}
			<span role="status" className="sr-only">
				{copied ? "Copied" : ""}
			</span>
		</button>
	);
}

/**
 * VS Code–style fenced code block with a title bar (language label)
 * and a copy-to-clipboard button.
 */
function CodeBlock({ language, code }: { language: string; code: string }) {
	const label = LANGUAGE_LABELS[language] ?? language;
	return (
		<div className="not-prose group overflow-hidden rounded-xl border border-white/8 bg-[#1e1e1e]">
			<div className="flex items-center justify-between border-b border-white/6 bg-[#252526] px-4 py-1.5">
				<span className="text-[0.6875rem] font-medium text-zinc-500">{label}</span>
				<CopyButton text={code} />
			</div>

			<SyntaxHighlighter
				style={vscDarkPlus}
				language={language}
				PreTag="div"
				customStyle={{
					margin: 0,
					padding: "1rem 1.25rem",
					background: "transparent",
					fontSize: "0.8125rem",
					lineHeight: "1.7"
				}}>
				{code}
			</SyntaxHighlighter>
		</div>
	);
}

/**
 * Renders README.md with GitHub-flavored markdown and
 * VS Code–style syntax-highlighted code blocks.
 */
export function ReadmeContent({ content }: ReadmeContentProps) {
	return (
		<div className="prose prose-invert prose-headings:text-zinc-50 prose-h1:border-b prose-h1:border-white/6 prose-h1:pb-3 prose-h1:first:hidden prose-h2:border-b prose-h2:border-white/4 prose-h2:pb-2 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-code:rounded-md prose-code:border prose-code:border-white/6 prose-code:bg-white/6 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-zinc-200 prose-code:before:content-[''] prose-code:after:content-[''] prose-blockquote:border-blue-500/30 prose-blockquote:bg-blue-500/4 prose-blockquote:rounded-r-lg prose-th:text-zinc-400 prose-td:border-white/4 prose-th:border-white/8 prose-pre:bg-transparent prose-pre:p-0 max-w-none text-zinc-300">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					code({ className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || "");
						const codeString = String(children).replace(/\n$/, "");
						if (match) {
							return <CodeBlock language={match[1]} code={codeString} />;
						}

						return (
							<code className={className} {...props}>
								{children}
							</code>
						);
					}
				}}>
				{content}
			</ReactMarkdown>
		</div>
	);
}
