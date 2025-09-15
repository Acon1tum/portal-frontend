"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, CornerDownRight } from 'lucide-react';

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  user: string;
  avatar: string;
  text: string;
}

const dummyComments: Comment[] = [
  {
    id: '1',
    user: 'John Doe',
    avatar: '/avatars/01.png',
    text: 'This is a great post!',
    replies: [
      {
        id: 'r1',
        user: 'Jane Smith',
        avatar: '/avatars/02.png',
        text: 'I agree!',
      },
    ],
  },
  {
    id: '2',
    user: 'Peter Jones',
    avatar: '/avatars/03.png',
    text: 'Thanks for sharing!',
    replies: [],
  },
];

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newId = (comments.length + 1).toString();
      setComments([
        ...comments,
        {
          id: newId,
          user: 'Current User', // Replace with actual user data
          avatar: '/avatars/04.png',
          text: newComment,
          replies: [],
        },
      ]);
      setNewComment('');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Comments</h3>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-4">
            <User className="w-10 h-10 text-gray-400" />
            <div className="flex-1">
              <p className="font-semibold">{comment.user}</p>
              <p>{comment.text}</p>
              <div className="mt-2">
                <Button variant="ghost" size="sm">
                  <CornerDownRight className="w-4 h-4 mr-2" />
                  Reply
                </Button>
              </div>
              <div className="mt-4 space-y-4 ml-8">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start space-x-4">
                    <User className="w-8 h-8 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-semibold">{reply.user}</p>
                      <p>{reply.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center space-x-4">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button onClick={handleAddComment}>Comment</Button>
      </div>
    </div>
  );
}
