import { Request, Response } from 'express';
import Post from '../models/Post';

export async function topAuthors(_req: Request, res: Response) {
    const data = await Post.aggregate([
        { $group: { _id: '$author', postCount: { $sum: 1 } } },
        { $sort: { postCount: -1, _id: 1 } },
    ]);
    return res.json(data.map((d) => ({ author: d._id, postCount: d.postCount })));
}

export async function topCommented(_req: Request, res: Response) {
    const data = await Post.aggregate([
        {
            $lookup: {
                from: 'comments',            // collection name in MongoDB
                localField: '_id',           // post._id
                foreignField: 'postId',      // comment.postId
                as: 'comments'
            }
        },
        {
            $addFields: {
                commentCount: { $size: '$comments' }
            }
        },
        { $sort: { commentCount: -1, createdAt: -1 } },
        { $limit: 5 },
        { $project: { title: 1, author: 1, commentCount: 1 } },
    ]);
    return res.json(data);
}

export async function postsPerDay(_req: Request, res: Response) {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const data = await Post.aggregate([
        { $match: { createdAt: { $gte: start } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
    ]);

    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - (6 - i));
        const key = d.toISOString().slice(0, 10);
        days.push(key);
    }

    const map = new Map<string, number>(data.map((d) => [d._id as string, d.count as number]));
    const result = days.map((d) => ({ day: d, count: map.get(d) ?? 0 }));
    return res.json(result);
}
