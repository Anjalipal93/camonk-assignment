import { useState } from 'react';
import { useCreateBlog } from '@/hooks/useBlogs';
import { CreateBlogData } from '@/api/blogs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateBlogFormProps {
  onSuccess?: () => void;
}

export const CreateBlogForm = ({ onSuccess }: CreateBlogFormProps) => {
  const [formData, setFormData] = useState<CreateBlogData>({
    title: '',
    category: [],
    description: '',
    coverImage: '',
    content: '',
    author: '',
  });

  const createBlog = useCreateBlog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !formData.author?.trim()) {
      return;
    }

    try {
      await createBlog.mutateAsync(formData);
      // Call success callback
      onSuccess?.();
      // Reset form on success
      setFormData({
        title: '',
        category: [],
        description: '',
        coverImage: '',
        content: '',
        author: '',
      });
    } catch (error) {
      console.error('Failed to create blog:', error);
    }
  };

  const handleCategoryChange = (value: string) => {
    const categories = value.split(',').map(cat => cat.trim()).filter(cat => cat);
    setFormData(prev => ({ ...prev, category: categories }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Blog</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter blog title"
              required
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-1">
              Author Name *
            </label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Categories (comma-separated)
            </label>
            <Input
              id="category"
              value={formData.category.join(', ')}
              onChange={(e) => handleCategoryChange(e.target.value)}
              placeholder="React, TypeScript, Frontend"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the blog"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium mb-1">
              Cover Image URL
            </label>
            <Input
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content *
            </label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your blog content here..."
              rows={10}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={createBlog.isPending}
            className="w-full"
          >
            {createBlog.isPending ? 'Creating...' : 'Create Blog'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};