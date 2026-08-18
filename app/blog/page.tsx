import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import { BLOG_POSTS } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering write-ups from building Aegis AI, an AI-powered network intrusion detection system (NIDS) — what broke in production and how it got fixed.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-20 w-full flex-1">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-10">
          Blog
        </h1>
        <div className="space-y-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border border-border-subtle bg-surface p-6"
            >
              <time
                dateTime={post.publishedAt}
                className="text-xs font-mono-num text-text-faint"
              >
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="text-xl font-semibold mt-2 mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-signal transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-signal hover:underline text-sm"
              >
                Read the full story
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
