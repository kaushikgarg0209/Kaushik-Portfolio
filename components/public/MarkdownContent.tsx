import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

const markdownComponents: Components = {
  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-white/10">
      <table {...props} className="min-w-full">
        {children}
      </table>
    </div>
  ),
};

const proseClasses = cn(
  "prose prose-invert max-w-none",
  "prose-headings:font-semibold prose-headings:text-white",
  "prose-p:text-slate-300 prose-li:text-slate-300",
  "prose-strong:text-white prose-em:text-slate-200",
  "prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline",
  "prose-blockquote:border-cyan-500/30 prose-blockquote:text-slate-400",
  "prose-hr:border-white/10",
  "prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-300 prose-code:before:content-none prose-code:after:content-none",
  "prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/40",
  "prose-table:my-0 prose-table:w-full prose-table:border-collapse",
  "prose-th:border prose-th:border-white/10 prose-th:bg-white/5 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-white",
  "prose-td:border prose-td:border-white/10 prose-td:px-4 prose-td:py-2 prose-td:text-slate-300",
  "prose-thead:border-b prose-thead:border-white/10",
);

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn(proseClasses, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
