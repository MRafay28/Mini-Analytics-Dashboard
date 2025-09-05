import mongoose, { Schema, Document } from 'mongoose';

interface IPost extends Document {
    title: string;
    content: string;
    author: string;
    createdAt: Date;
}

const PostSchema = new Schema<IPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPost>('Post', PostSchema);
