import { useState } from 'react';
import { Blog } from '@/api/blogs';
import { BlogList } from '@/components/BlogList';
import { BlogDetail } from '@/components/BlogDetail';
import { CreateBlogForm } from '@/components/CreateBlogForm';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Sparkles } from 'lucide-react';

export const Home = () => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleBlogSelect = (blog: Blog) => {
    setSelectedBlog(blog);
  };

  const handleBlogDelete = (blogId: number) => {
    // Clear selected blog if it was deleted
    if (selectedBlog?.id === blogId) {
      setSelectedBlog(null);
    }
  };

  const handleBlogCreated = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-indigo-950 dark:via-slate-900 dark:to-cyan-950">
      {/* Success Notification */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg border border-green-400">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
              <span className="font-medium">Blog post created successfully!</span>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-lg border-indigo-200 dark:border-indigo-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-lg shadow-md">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  BlogSpace
                </h1>
                <p className="text-sm text-indigo-600 dark:text-cyan-400">Discover amazing stories</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsAdminMode(!isAdminMode)}
                variant={isAdminMode ? "default" : "outline"}
                className={isAdminMode ? "bg-red-500 hover:bg-red-600 border-red-500" : "border-indigo-300 text-indigo-700 hover:bg-indigo-50"}
              >
                {isAdminMode ? 'Exit Admin' : 'Admin Mode'}
              </Button>
              <div className="relative group">
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className={`shadow-lg hover:shadow-xl transition-all duration-200 border-0 ${
                    showCreateForm
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 ring-2 ring-green-300'
                      : 'bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700'
                  }`}
                  title={showCreateForm ? 'Hide the blog creation form' : 'Show blog creation form'}
                >
                  {showCreateForm ? (
                    <>
                      <div className="h-4 w-4 mr-2 rounded-full bg-white/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                      Hide Form
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Write Blog
                    </>
                  )}
                </Button>
                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {showCreateForm ? 'Click to hide the form' : 'Click to write a new blog post'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Add padding for fixed header and footer */}
      <main className="container mx-auto px-4 py-8 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Blog List */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold">Latest Posts</h2>
            </div>
            <BlogList
              onBlogSelect={handleBlogSelect}
              onBlogDelete={handleBlogDelete}
              showDeleteButtons={isAdminMode}
            />

            {/* Create Form Toggle */}
            {showCreateForm && (
              <div
                id="create-blog-form"
                className="animate-in slide-in-from-bottom-4 duration-500 border-2 border-indigo-300 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-950/50 shadow-xl"
                onAnimationEnd={() => {
                  // Scroll to form when it appears
                  document.getElementById('create-blog-form')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                  });
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full flex items-center justify-center animate-bounce">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-700 dark:text-cyan-300">✍️ Create New Blog Post</h3>
                    <p className="text-sm text-indigo-600 dark:text-cyan-400">Fill out the form below to share your story</p>
                  </div>
                </div>
                <CreateBlogForm onSuccess={handleBlogCreated} />
              </div>
            )}
          </div>

          {/* Right Panel - Blog Detail */}
          <div className="lg:col-span-8">
            <BlogDetail
              blog={selectedBlog}
              onDelete={handleBlogDelete}
              showDeleteButton={isAdminMode}
            />
          </div>
        </div>
      </main>

      {/* Footer - Fixed positioning for stability */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-indigo-200 dark:border-indigo-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-md">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-indigo-700 dark:text-cyan-300">BlogSpace</span>
            </div>
            <p className="text-sm text-indigo-600 dark:text-cyan-400 text-center">
              © 2026 BlogSpace. Built with React, TypeScript, and TanStack Query.
            </p>
            <div className="flex gap-4 text-sm text-indigo-600 dark:text-cyan-400">
              <span>✨ Modern</span>
              <span>🚀 Fast</span>
              <span>🎨 Beautiful</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};