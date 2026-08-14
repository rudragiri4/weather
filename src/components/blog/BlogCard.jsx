import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight } from 'lucide-react';

export const BlogCard = ({ post }) => {
  return (
    <article className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col group">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-cyan-400 border border-cyan-500/30">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-cyan-400" /> {post.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition leading-snug">
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
            {post.summary}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800/80">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition group/link"
          >
            Read Full Article <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};
