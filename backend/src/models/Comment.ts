import mongoose, { Schema, Document } from 'mongoose';

interface IComment extends Document {
    postId: mongoose.Types.ObjectId;
    text: string;
    commenter: string;
    createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    text: { type: String, required: true },
    commenter: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>('Comment', CommentSchema);
