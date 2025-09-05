import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { addComment, fetchPosts } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CommentModal from '../components/CommentModal';
import { useDebounce } from '../hooks/useDebounce';

export default function PostsList() {
    const { user } = useAuth();
    const [author, setAuthor] = useState('');
    const [q, setQ] = useState('');
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<{ items: any[]; total: number; page: number; limit: number } | null>(null);
    const [commentModal, setCommentModal] = useState<{ isOpen: boolean; postId: string; postTitle: string }>({
        isOpen: false,
        postId: '',
        postTitle: ''
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page') || 1);

    const debouncedAuthor = useDebounce(author, 500);
    const debouncedQ = useDebounce(q, 500);

    const totalPages = useMemo(() => (data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1), [data]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const res = await fetchPosts({
                    page,
                    limit,
                    author: debouncedAuthor || undefined,
                    q: debouncedQ || undefined
                });
                if (!cancelled) setData(res);
            } catch (err) {
                if (!cancelled) setData({ items: [], total: 0, page, limit });
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [debouncedAuthor, debouncedQ, page, limit]);

    function openCommentModal(postId: string, postTitle: string) {
        if (!user) {
            alert('Please login to add comments');
            return;
        }
        setCommentModal({ isOpen: true, postId, postTitle });
    }

    async function handleCommentSubmit(text: string) {
        try {
            await addComment(commentModal.postId, { text });
            const res = await fetchPosts({
                page,
                limit,
                author: debouncedAuthor || undefined,
                q: debouncedQ || undefined
            });
            setData(res);
        } catch (err) {
            alert('Failed to add comment');
            throw err;
        }
    }

    function closeCommentModal() {
        setCommentModal({ isOpen: false, postId: '', postTitle: '' });
    }

    function updatePage(newPage: number) {
        setSearchParams({ page: newPage.toString() });
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Blog Posts</h2>

                {/* Search and Filter */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                Search by title
                                {q !== debouncedQ && (
                                    <span className="ml-2 text-xs text-indigo-600">(searching...)</span>
                                )}
                            </label>
                            <input
                                id="search"
                                type="text"
                                placeholder="Search posts..."
                                value={q}
                                onChange={(e) => { setQ(e.target.value); updatePage(1); }}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by author
                                {author !== debouncedAuthor && (
                                    <span className="ml-2 text-xs text-indigo-600">(searching...)</span>
                                )}
                            </label>
                            <input
                                id="author"
                                type="text"
                                placeholder="Type any part of author name..."
                                value={author}
                                onChange={(e) => { setAuthor(e.target.value); updatePage(1); }}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => { setQ(''); setAuthor(''); updatePage(1); }}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Posts List */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {data?.items.map((p) => (
                            <div key={p._id} className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-6 py-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900">{p.title}</h3>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm text-gray-500">by {p.author}</span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {p.commentCount ?? p._commentsCount ?? 0} comments
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mt-2">{p.content}</p>
                                    <div className="mt-4 flex justify-end">
                                        {user ? (
                                            <button
                                                onClick={() => openCommentModal(p._id, p.title)}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Add Comment
                                            </button>
                                        ) : (
                                            <Link
                                                to="/login"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                            >
                                                Login to Comment
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {data && data.items.length > 0 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => updatePage(page - 1)}
                                        disabled={page <= 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => updatePage(page + 1)}
                                        disabled={page >= totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing page <span className="font-medium">{data?.page ?? page}</span> of{' '}
                                            <span className="font-medium">{totalPages}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => updatePage(page - 1)}
                                                disabled={page <= 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => updatePage(page + 1)}
                                                disabled={page >= totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Comment Modal */}
            <CommentModal
                isOpen={commentModal.isOpen}
                onClose={closeCommentModal}
                onSubmit={handleCommentSubmit}
                postTitle={commentModal.postTitle}
            />
        </div>
    );
}
