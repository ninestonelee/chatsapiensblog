import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { motion } from "motion/react";
import type { Post } from "../lib/posts";

interface PostViewProps {
  post: Post;
  onBack: () => void;
}

export default function PostView({ post, onBack }: PostViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = `${post.title} | 챗사피엔스 블로그`;
    return () => {
      document.title = "챗사피엔스 블로그";
    };
  }, [post]);

  return (
    <main className="max-w-4xl mx-auto px-4 pt-32 pb-24">
      <button
        onClick={onBack}
        className="mb-8 px-4 py-2 text-sm font-bold uppercase tracking-tighter bevel-out active:scale-95 flex items-center gap-2"
      >
        <ArrowLeft size={16} /> 목록으로
      </button>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticker-card !rounded-[28px] p-6 md:p-12"
      >
        <header className="mb-10 border-b-4 border-dashed border-black/10 pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-y2k-pink bg-y2k-pink/10 px-3 py-1 rounded-full">
              {post.category}
            </span>
            {post.date && (
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                <Calendar size={12} /> {post.date}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight text-gray-900 break-keep">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-lg text-gray-600 font-medium leading-relaxed break-keep">{post.excerpt}</p>
          )}
          {post.cover && (
            <img
              src={post.cover}
              alt={post.title}
              className="mt-8 w-full rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_rgba(0,0,0,0.15)]"
            />
          )}
        </header>

        <div className="post-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
              img: ({ node, ...props }) => <img {...props} loading="lazy" />,
              table: ({ node, ...props }) => (
                <div className="table-wrap">
                  <table {...props} />
                </div>
              ),
            }}
          >
            {post.body ?? ""}
          </ReactMarkdown>
        </div>

        {post.tags.length > 0 && (
          <footer className="mt-12 pt-6 border-t-4 border-dashed border-black/10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-bold px-3 py-1 bg-white border-2 border-black rounded-full flex items-center gap-1"
              >
                <Tag size={10} /> {tag}
              </span>
            ))}
          </footer>
        )}
      </motion.article>

      <div className="mt-12 flex justify-center">
        <button onClick={onBack} className="relative group">
          <div className="absolute inset-0 bg-y2k-blue translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
          <div className="relative bg-white border-4 border-black px-10 py-3 font-black uppercase tracking-widest">
            다른 글 보기
          </div>
        </button>
      </div>
    </main>
  );
}
