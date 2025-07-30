"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PostViewRedirect() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  useEffect(() => {
    if (postId) {
      router.replace(`/posts/${postId}`);
    }
  }, [postId, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to post...</p>
      </div>
    </div>
  );
} 