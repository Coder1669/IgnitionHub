import React from "react";
import { jwtDecode } from "jwt-decode";
import StarRating from "./StarRating";

const getCurrentUserEmail = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.sub;
  } catch (e) {
    return null;
  }
};

const ReviewList = ({ reviews, onEdit, onDelete }) => {
  const currentUserEmail = getCurrentUserEmail();

  if (!reviews || reviews.length === 0) {
    return <p className="mt-4 text-gray-400">Be the first to review this car!</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-xl font-semibold text-white mb-3">
        Reviews ({reviews.length})
      </h3>
      {reviews.map((review) => {
        const isOwner = currentUserEmail === review.user?.email;
        return (
          <div
            key={review.id}
            className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 shadow-md"
          >
            <div className="flex justify-between items-center">
              <div>
                <h5 className="text-white font-medium flex items-center gap-2">
                  {review.user?.name || "User"}
                  {isOwner && (
                    <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-md">
                      You
                    </span>
                  )}
                </h5>
                <StarRating rating={review.rating} />
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(review)}
                    className="px-3 py-1 text-sm rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(review.id)}
                    className="px-3 py-1 text-sm rounded-lg border border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2 text-gray-300">{review.comment}</p>
            <small className="text-gray-500">
              Reviewed on: {new Date(review.createdAt).toLocaleString()}
            </small>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
