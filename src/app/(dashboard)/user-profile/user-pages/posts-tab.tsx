import { useState } from "react";
import { User, Calendar, MessageSquare, ThumbsUp, Share2, Edit, Trash2, Plus, Filter, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User as UserType, PostType } from "@/utils/types";

interface PostsTabProps {
  user: UserType;
}

interface Post {
  id: string;
  title: string;
  content: string;
  postType: PostType;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  shares: number;
  organization?: {
    id: string;
    name: string;
    logo?: string;
  };
}

export default function PostsTab({ user }: PostsTabProps) {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "Welcome to the Maritime Industry",
      content: "Excited to share my journey in the maritime sector. Looking forward to connecting with fellow professionals and contributing to this dynamic industry.",
      postType: PostType.GENERAL,
      isPublished: true,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      likes: 24,
      comments: 8,
      shares: 3,
      organization: {
        id: "1",
        name: "Maritime Solutions Inc.",
        logo: undefined
      }
    },
    {
      id: "2",
      title: "New Job Opportunity Available",
      content: "We're hiring experienced seafarers for our international fleet. Great benefits and competitive salary. Contact me for more details.",
      postType: PostType.JOB_LISTING,
      isPublished: true,
      createdAt: "2024-01-10T14:20:00Z",
      updatedAt: "2024-01-10T14:20:00Z",
      likes: 45,
      comments: 12,
      shares: 7,
      organization: {
        id: "1",
        name: "Maritime Solutions Inc.",
        logo: undefined
      }
    },
    {
      id: "3",
      title: "Industry Conference Announcement",
      content: "Join us at the upcoming Maritime Technology Conference in Singapore. Great networking opportunities and latest industry insights.",
      postType: PostType.EVENT,
      isPublished: true,
      createdAt: "2024-01-05T09:15:00Z",
      updatedAt: "2024-01-05T09:15:00Z",
      likes: 18,
      comments: 5,
      shares: 2
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<PostType | "all">("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || post.postType === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getPostTypeColor = (type: PostType) => {
    const colors = {
      [PostType.JOB_LISTING]: "bg-green-100 text-green-800",
      [PostType.ANNOUNCEMENT]: "bg-blue-100 text-blue-800",
      [PostType.NEWS]: "bg-purple-100 text-purple-800",
      [PostType.EVENT]: "bg-orange-100 text-orange-800",
      [PostType.PROMOTION]: "bg-yellow-100 text-yellow-800",
      [PostType.GENERAL]: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreatePost = () => {
    setShowCreateForm(true);
  };

  const handleEditPost = (postId: string) => {
    // Implement edit functionality
    console.log("Edit post:", postId);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Posts</h2>
          <p className="text-muted-foreground">Manage and view your posts</p>
        </div>
        <Button onClick={handleCreatePost} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("all")}
          >
            All
          </Button>
          {Object.values(PostType).map((type) => (
            <Button
              key={type}
              variant={selectedFilter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(type)}
            >
              {type.replace(/_/g, ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getPostTypeColor(post.postType)}>
                      {post.postType.replace(/_/g, ' ')}
                    </Badge>
                    {post.isPublished ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Draft
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditPost(post.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {post.content}
              </p>
              
              {post.organization && (
                <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {post.organization.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{post.organization.name}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>{post.shares}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">No posts found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedFilter !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Start sharing your thoughts and experiences with the community."
            }
          </p>
          <Button onClick={handleCreatePost}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Post
          </Button>
        </div>
      )}

      {/* Create Post Form (Modal-like) */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Create New Post</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Post Type</label>
                  <select className="w-full p-2 border rounded-md">
                    {Object.values(PostType).map((type) => (
                      <option key={type} value={type}>
                        {type.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input placeholder="Enter post title..." />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea 
                    className="w-full p-2 border rounded-md min-h-[120px]"
                    placeholder="Write your post content..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => setShowCreateForm(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button>
                    Create Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
