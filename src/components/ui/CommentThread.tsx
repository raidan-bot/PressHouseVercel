import React, { useState } from 'react';
import { ThumbsUp, Reply, Flag } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface CommentAuthor {
  name: string;
  avatar?: string;
  role?: string;
}

interface Comment {
  id: string;
  author: CommentAuthor;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
  liked?: boolean;
}

interface CommentThreadProps {
  comments: Comment[];
  onReply?: (commentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
  className?: string;
}

export function CommentThread({
  comments,
  onReply,
  onLike,
  onReport,
  className,
}: CommentThreadProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = (commentId: string) => {
    if (replyContent.trim()) {
      onReply?.(commentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-4">
          {/* Main comment */}
          <CommentItem
            comment={comment}
            onReply={() => setReplyingTo(comment.id)}
            onLike={() => onLike?.(comment.id)}
            onReport={() => onReport?.(comment.id)}
          />

          {/* Reply input */}
          {replyingTo === comment.id && (
            <div className="ml-12 flex gap-3">
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-3 rounded-xl border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleReply(comment.id)}>
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-12 space-y-4 pl-4 border-l-2 border-slate-100">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={() => setReplyingTo(reply.id)}
                  onLike={() => onLike?.(reply.id)}
                  onReport={() => onReport?.(reply.id)}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  onReply: () => void;
  onLike: () => void;
  onReport: () => void;
  isReply?: boolean;
  key?: React.Key;
}

function CommentItem({
  comment,
  onReply,
  onLike,
  onReport,
  isReply = false,
}: CommentItemProps) {
  return (
    <div className={cn('flex gap-3', isReply && 'mt-4')}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
          {comment.author.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-slate-900 text-sm">{comment.author.name}</span>
          {comment.author.role && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              {comment.author.role}
            </span>
          )}
          <span className="text-slate-400 text-xs">{comment.timestamp}</span>
        </div>

        {/* Content */}
        <p className="text-slate-700 text-sm leading-relaxed">{comment.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={onLike}
            className={cn(
              'flex items-center gap-1 text-xs font-medium transition-colors',
              comment.liked ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <ThumbsUp size={14} />
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </button>
          <button
            onClick={onReply}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Reply size={14} />
            Reply
          </button>
          <button
            onClick={onReport}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Flag size={14} />
            Report
          </button>
        </div>
      </div>
    </div>
  );
}

export { CommentItem };
export default CommentThread;