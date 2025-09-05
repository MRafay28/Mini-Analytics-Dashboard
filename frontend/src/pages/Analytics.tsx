import { useEffect, useState } from 'react';
import { fetchPostsPerDay, fetchTopAuthors, fetchTopCommented } from '../services/api';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function Analytics() {
    const [topAuthors, setTopAuthors] = useState<Array<{ author: string; postCount: number }>>([]);
    const [topCommented, setTopCommented] = useState<Array<{ _id: string; title: string; author: string; commentCount: number }>>([]);
    const [perDay, setPerDay] = useState<Array<{ day: string; count: number }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [a, c, d] = await Promise.all([
                    fetchTopAuthors(),
                    fetchTopCommented(),
                    fetchPostsPerDay(),
                ]);
                setTopAuthors(a);
                setTopCommented(c);
                setPerDay(d);
            } catch (err) {
                setTopAuthors([]);
                setTopCommented([]);
                setPerDay([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>

                {/* Top Authors and Most Commented Posts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Top Authors */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Top Authors</h3>
                        </div>
                        <div className="px-6 py-4">
                            {topAuthors.length > 0 ? (
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Author
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Posts
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {topAuthors.map((a, index) => (
                                                <tr key={a.author} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {a.author}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                            {a.postCount}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No authors found</p>
                            )}
                        </div>
                    </div>

                    {/* Most Commented Posts */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Most Commented Posts</h3>
                        </div>
                        <div className="px-6 py-4">
                            {topCommented.length > 0 ? (
                                <ol className="space-y-4">
                                    {topCommented.map((p, index) => (
                                        <li key={p._id} className="flex items-start">
                                            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </span>
                                            <div className="ml-4 flex-1">
                                                <p className="text-sm font-medium text-gray-900">{p.title}</p>
                                                <p className="text-sm text-gray-500">by {p.author}</p>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                                    {p.commentCount} comments
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No posts found</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Posts per Day Chart */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Posts per Day (Last 7 Days)</h3>
                    </div>
                    <div className="px-6 py-4">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={perDay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="day"
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        stroke="#6b7280"
                                        fontSize={12}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#f9fafb',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                        labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="#4f46e5"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
