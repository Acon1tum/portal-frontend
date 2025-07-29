import { Business } from "@/utils/types";
import { Star } from "lucide-react";
import { getReviews, getReviewPercentage } from "./business-data";
import { useState } from "react";

interface ReviewsTabProps {
  business: Business;
}

export default function ReviewsTab({ business }: ReviewsTabProps) {
  const reviews = getReviews();
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });

  // Filter reviews by rating if a filter is selected
  const filteredReviews = ratingFilter 
    ? reviews.filter(review => review.rating === ratingFilter)
    : reviews;

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const formattedAverage = averageRating.toFixed(1);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the review to an API
    alert("Review submitted successfully! (This is a demo)");
    setShowReviewForm(false);
    setNewReview({ rating: 5, title: "", comment: "" });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Customer Reviews</h2>
          <button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </button>
        </div>
        
        {/* Review form */}
        {showReviewForm && (
          <div className="bg-card rounded-lg shadow-sm p-6 mb-8 border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Share Your Experience</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-muted-foreground mb-2">Your Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className="text-chart-4 p-1 focus:outline-none"
                    >
                      <Star 
                        className="h-8 w-8" 
                        fill={star <= newReview.rating ? "currentColor" : "none"} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="review-title" className="block text-muted-foreground mb-2">Title</label>
                <input 
                  id="review-title"
                  type="text" 
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  placeholder="Summarize your experience"
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="review-comment" className="block text-muted-foreground mb-2">Review</label>
                <textarea 
                  id="review-comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Tell others about your experience with this business"
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Rating summary */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-card-foreground">{formattedAverage}</span>
              <div className="flex text-chart-4 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="h-5 w-5" 
                    fill={star <= Math.round(averageRating) ? "currentColor" : "none"} 
                  />
                ))}
              </div>
              <span className="text-muted-foreground mt-2">Based on {reviews.length} reviews</span>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button 
                  key={rating} 
                  onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
                  className={`w-full flex items-center transition ${
                    ratingFilter === rating 
                      ? 'bg-primary/10 rounded' 
                      : 'hover:bg-secondary rounded'
                  }`}
                >
                  <span className="text-muted-foreground w-8">{rating} ★</span>
                  <div className="flex-1 h-2 mx-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-chart-4" 
                      style={{ width: `${getReviewPercentage(rating)}%` }}
                    ></div>
                  </div>
                  <span className="text-muted-foreground w-16">{getReviewPercentage(rating)}%</span>
                </button>
              ))}
              {ratingFilter && (
                <button 
                  onClick={() => setRatingFilter(null)}
                  className="mt-2 text-sm text-primary hover:underline flex items-center"
                >
                  <span>Clear filter</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Reviews list */}
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg">
              <p className="text-muted-foreground">No reviews match the selected filter.</p>
              {ratingFilter && (
                <button 
                  onClick={() => setRatingFilter(null)}
                  className="mt-2 text-primary hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            filteredReviews.map((review, index) => (
              <div key={index} className="bg-card rounded-lg shadow-sm p-6">
                <div className="flex justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold mr-3">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">{review.author}</h3>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex text-chart-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4" fill={star <= review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
                {review.response && (
                  <div className="mt-4 pl-4 border-l-2 border-border">
                    <p className="text-sm font-medium text-card-foreground">Response from {business.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{review.response}</p>
                  </div>
                )}
                <div className="mt-4 flex space-x-4">
                  <button className="text-xs text-primary hover:underline">Like</button>
                  <button className="text-xs text-primary hover:underline">Report</button>
                  <button className="text-xs text-primary hover:underline">Share</button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pagination */}
        {filteredReviews.length > 5 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-primary/10 transition">
                Previous
              </button>
              <button className="px-3 py-1 bg-primary text-primary-foreground rounded">
                1
              </button>
              <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-primary/10 transition">
                2
              </button>
              <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-primary/10 transition">
                3
              </button>
              <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-primary/10 transition">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}