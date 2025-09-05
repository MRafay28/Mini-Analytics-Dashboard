export interface PostDto {
    title: string;
    content: string;
    author: string;
    _commentsCount?: number;
}

export interface PostWithCounts extends PostDto {
    _id: string;
    createdAt: string;
    updatedAt: string;
    commentCount: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}

import axios from 'axios';

const baseURL = (import.meta as any).env.VITE_API_URL || 'http://localhost:4000';
export const api = axios.create({ baseURL });

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function createPost(data: { title: string; content: string }) {
    const res = await api.post('/api/posts', data);
    return res.data as PostWithCounts;
}

export async function addComment(postId: string, data: { text: string }) {
    const res = await api.post(`/api/posts/${postId}/comments`, data);
    return res.data;
}

export async function fetchPosts(params: { page?: number; limit?: number; author?: string; q?: string } = {}) {
    const res = await api.get('/api/posts', { params });
    return res.data as PaginatedResponse<PostWithCounts>;
}

export async function fetchTopAuthors() {
    const res = await api.get('/api/analytics/top-authors');
    return res.data as Array<{ author: string; postCount: number }>;
}

export async function fetchTopCommented() {
    const res = await api.get('/api/analytics/top-commented');
    return res.data as Array<{ _id: string; title: string; author: string; commentCount: number }>;
}

export async function fetchPostsPerDay() {
    const res = await api.get('/api/analytics/posts-per-day');
    return res.data as Array<{ day: string; count: number }>;
}
