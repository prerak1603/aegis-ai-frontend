import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Nav from "@/components/Nav";
import { BLOG_POSTS, getBlogPost } from "@/lib/blogPosts";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-20 w-full flex-1">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>
        <time dateTime={post.publishedAt} className="text-xs font-mono-num text-text-faint">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2 mb-10">
          {post.title}
        </h1>
        <div className="space-y-10">
          {post.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="text-text-muted leading-relaxed mb-4">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="space-y-2 list-disc list-inside">
                  {section.bullets.map((b, j) => (
                    <li key={j} className="text-text-muted leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-border-subtle">
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-ink font-medium hover:opacity-90 transition-opacity"
          >
            Try the live demo
          </Link>
        </div>
      </main>
    </>
  );
}
