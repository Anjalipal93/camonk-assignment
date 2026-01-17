import { Blog } from '@/api/blogs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, ArrowRight, Trash2, Heart, Share2 } from 'lucide-react';
import { useDeleteBlog } from '@/hooks/useBlogs';

interface BlogCardProps {
  blog: Blog;
  onClick: (blog: Blog) => void;
  onDelete?: (blogId: number) => void;
  showDeleteButton?: boolean;
}

export const BlogCard = ({ blog, onClick, onDelete, showDeleteButton = false }: BlogCardProps) => {
  const deleteBlog = useDeleteBlog();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

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

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 hover:-translate-y-1 hover:scale-[1.02] relative"
      onClick={() => onClick(blog)}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 flex gap-2">
          {blog.category.slice(0, 2).map((cat, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-white/90 text-slate-800 hover:bg-white shadow-sm text-xs font-medium"
            >
              {cat}
            </Badge>
          ))}
        </div>
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <ArrowRight className="h-4 w-4 text-slate-700" />
          </div>
        </div>

        {/* Delete Button - Only show if enabled */}
        {showDeleteButton && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="destructive"
              className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 shadow-lg"
              onClick={handleDelete}
              disabled={deleteBlog.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-tight">
          {blog.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
          {blog.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(blog.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>{blog.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-4 w-4 text-blue-500" />
              <span>{blog.shares || 0}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>Read more</span>
          </div>
        </div>

        {/* Additional categories */}
        {blog.category.length > 2 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {blog.category.slice(2).map((cat, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-0.5 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {cat}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-lg transition-all duration-300 pointer-events-none" />
    </Card>
  );
};