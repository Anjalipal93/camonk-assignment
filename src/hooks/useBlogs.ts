import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogsApi } from '@/api/blogs';

export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: blogsApi.getAll,
  });
};

export const useBlog = (id: number) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};