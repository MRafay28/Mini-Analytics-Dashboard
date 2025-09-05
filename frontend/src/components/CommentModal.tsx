import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (text: string) => void;
    postTitle: string;
}

export default function CommentModal({ isOpen, onClose, onSubmit, postTitle }: CommentModalProps) {
    const { user } = useAuth();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        try {
            await onSubmit(text.trim());
            setText('');
            onClose();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setText('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={handleClose}
                />

                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Add Comment
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Commenting on: <span className="font-medium text-gray-900">"{postTitle}"</span>
                                    </p>
                                    {user && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Commenting as: <span className="font-medium text-indigo-600">{user.username}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4">
                            <div>
                                <label htmlFor="comment-text" className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Comment
                                </label>
                                <textarea
                                    id="comment-text"
                                    rows={4}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Write your comment here..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="submit"
                                    disabled={loading || !text.trim()}
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    {loading ? 'Adding...' : 'Add Comment'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
