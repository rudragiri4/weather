import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { BLOG_POSTS } from '../services/blogData';
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react';
import { BlogCard } from '../components/blog/BlogCard';

export const BlogPostPage = () => {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

  const related = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.summary,
    'author': {
      '@type': 'Person',
      'name': post.author
    },
    'datePublished': post.date,
    'image': post.image
  };

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.summary}
        canonicalPath={`/blog/${post.slug}`}
        schemaData={articleSchema}
      />

      <article className="max-w-4xl mx-auto space-y-8 py-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Articles
        </Link>

        {/* Hero header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-bold text-cyan-400">
            <span className="bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
              {post.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-800 text-xs text-slate-400">
            <div className="font-semibold text-slate-200">{post.author}</div>
            <span>—</span>
            <div>{post.role}</div>
            <span>•</span>
            <div>{post.date}</div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-3xl overflow-hidden h-80 sm:h-96 border border-slate-800 shadow-2xl">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* HTML Article Content */}
        <div
          className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-6 pt-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="pt-12 border-t border-slate-800 space-y-6">
            <h3 className="font-display text-2xl font-bold text-white">Related Meteorological Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((r) => (
                <BlogCard key={r.id} post={r} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
};
