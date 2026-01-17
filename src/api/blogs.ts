import axios from 'axios';

const API_BASE_URL = 'http://localhost:3004';

export interface Blog {
  id: number;
  title: string;
  category: string[];
  description: string;
  date: string;
  coverImage: string;
  content: string;
  author?: string;
  likes?: number;
  shares?: number;
}

export interface CreateBlogData {
  title: string;
  category: string[];
  description: string;
  coverImage: string;
  content: string;
  author?: string;
}

export const blogsApi = {
  async getAll(): Promise<Blog[]> {
    const response = await axios.get<Blog[]>(`${API_BASE_URL}/blogs`);
    return response.data;
  },

  async getById(id: number): Promise<Blog> {
    const response = await axios.get<Blog>(`${API_BASE_URL}/blogs/${id}`);
    return response.data;
  },

  async create(data: CreateBlogData): Promise<Blog> {
    const response = await axios.post<Blog>(`${API_BASE_URL}/blogs`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/blogs/${id}`);
  },
};