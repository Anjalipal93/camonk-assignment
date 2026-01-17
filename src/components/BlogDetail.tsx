import { Blog } from '@/api/blogs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, BookOpen, Sparkles, Trash2, Heart, Share2 } from 'lucide-react';
import { useDeleteBlog } from '@/hooks/useBlogs';

interface BlogDetailProps {
  blog: Blog | null;
  onDelete?: (blogId: number) => void;
  showDeleteButton?: boolean;
}

export const BlogDetail = ({ blog, onDelete, showDeleteButton = false }: BlogDetailProps) => {
  const deleteBlog = useDeleteBlog();

  const handleDelete = async () => {
    if (!blog) return;

    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await deleteBlog.mutateAsync(blog.id);
        onDelete?.(blog.id);
      } catch (error) {
        console.error('Failed to delete blog:', error);
        alert('Failed to delete blog. Please try again.');
      }
    }
  };

  const handleShare = async () => {
    if (!blog) return;

    const shareData = {
      title: blog.title,
      text: blog.description,
      url: `${window.location.origin}/blog/${blog.id}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
      alert('Link copied to clipboard!');
    }
  };
  if (!blog) {
    return (
      <Card className="h-full min-h-[600px] bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700">
        <CardContent className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full">
            <BookOpen className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-300">
            Select a Blog Post
          </h3>
          <p className="text-muted-foreground max-w-md">
            Choose a blog post from the list to read the full content and details.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Discover amazing stories</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const readTime = Math.ceil(blog.content.split(' ').length / 200); // Rough estimate

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {blog.category.map((cat, index) => (
                <Badge
                  key={index}
                  className="bg-white/90 text-slate-800 hover:bg-white shadow-lg backdrop-blur-sm"
                >
                  {cat}
                </Badge>
              ))}
            </div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight flex-1">
                {blog.title}
              </h1>
              {showDeleteButton && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  variant="destructive"
                  size="sm"
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white shadow-lg"
                  disabled={deleteBlog.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(blog.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Author</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Content Section */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Description */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
                About This Post
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {blog.description}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                Full Content
              </h2>
              <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
                {blog.content}
              </div>
            </div>

            {/* Engagement Section */}
            <div className="border-t border-indigo-200 dark:border-indigo-800 pt-6 mt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400">
                    <Heart className="h-5 w-5 fill-current" />
                    <span className="font-medium">{blog.likes || 0} likes</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400">
                    <Share2 className="h-5 w-5" />
                    <span className="font-medium">{blog.shares || 0} shares</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="sm"
                    className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-600 dark:text-cyan-300 dark:hover:bg-indigo-900"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-indigo-100 dark:border-indigo-900">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{blog.author || 'Anonymous Author'}</p>
                    <p className="text-sm text-indigo-600 dark:text-cyan-400">
                      Published on {new Date(blog.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-cyan-400">
                  <Sparkles className="h-4 w-4" />
                  <span>Thanks for reading!</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};