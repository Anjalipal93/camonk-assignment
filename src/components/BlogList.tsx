import { Blog } from '@/api/blogs';
import { useBlogs } from '@/hooks/useBlogs';
import { BlogCard } from './BlogCard';

interface BlogListProps {
  onBlogSelect: (blog: Blog) => void;
  onBlogDelete?: (blogId: number) => void;
  showDeleteButtons?: boolean;
}

export const BlogList = ({ onBlogSelect, onBlogDelete, showDeleteButtons = false }: BlogListProps) => {
  const { data: blogs, isLoading, error } = useBlogs();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted h-32 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load blogs</p>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No blogs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          onClick={onBlogSelect}
          onDelete={onBlogDelete}
          showDeleteButton={showDeleteButtons}
        />
      ))}
    </div>
  );
};