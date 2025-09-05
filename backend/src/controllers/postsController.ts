import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post';
import Comment from '../models/Comment';
import { PipelineStage } from 'mongoose';
export async function createPost(req: Request, res: Response) {
    const { title, content } = req.body as { title: string; content: string };
    const author = req.user?.username;

    if (!title || !content) {
        return res.status(400).json({ message: 'title and content are required' });
    }

    if (!author) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const post = await Post.create({ title, content, author });
    return res.status(201).json(post);
}

export async function addComment(req: Request, res: Response) {
    const { id } = req.params;
    const { text } = req.body as { text: string };
    const commenter = req.user?.username;

    if (!text) {
        return res.status(400).json({ message: 'text is required' });
    }

    if (!commenter) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({
        postId: post._id,
        text,
        commenter,
    });

    return res.status(201).json(comment);
}

export async function listPosts(req: Request, res: Response) {
    const { author, q, page = '1', limit = '10' } = req.query as Record<string, string>;

    const sanitizeRegex = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const match: Record<string, unknown> = {};
    if (author) {
        match.author = { $regex: sanitizeRegex(author), $options: 'i' };
    }
    if (q) {
        match.title = { $regex: sanitizeRegex(q), $options: 'i' };
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const pipeline: PipelineStage[] = [
        { $match: match },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'postId',
                as: 'comments',
            },
        },
        {
            $addFields: {
                commentCount: { $size: '$comments' },
            },
        },
        {
            $project: {
                comments: 0,
            },
        },

        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },
    ];


    const [items, totalResult] = await Promise.all([
        Post.aggregate(pipeline),
        Post.countDocuments(match),
    ]);

    return res.json({
        items,
        total: totalResult,
        page: pageNum,
        limit: limitNum,
    });
}