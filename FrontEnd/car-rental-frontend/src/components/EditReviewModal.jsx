import React, { useState, useEffect } from "react";
import StarRating from "./StarRating";
import reviewService from "../services/review.service";
import { 
    Star, 
    MessageCircle, 
    Save, 
    X,
    AlertCircle,
    CheckCircle,
    RefreshCw,
    Edit3,
    Sparkles
} from 'lucide-react';

const EditReviewModal = ({ show, onHide, review, carId, onReviewUpdated }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (review) {
            setRating(review.rating);
            setComment(review.comment || "");
        }
    }, [review]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!review) return;
        if (rating === 0) {
            setError("Please select a rating to continue.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await reviewService.updateReview(carId, review.id, {
                rating,
                comment,
            });
            onReviewUpdated(response.data);
            onHide();
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Failed to update review. Please try again.";
            setError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setError("");
        onHide();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/20">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                            <Edit3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Edit Your Review</h2>
                            <p className="text-blue-200 text-sm">Update your rating and feedback</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl backdrop-blur-sm mb-6">
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Rating Section */}
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-3">
                                Your Rating <span className="text-red-400">*</span>
                            </label>
                            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                                <div className="flex items-center justify-center space-x-2 mb-3">
                                    <Star className="w-5 h-5 text-yellow-400" />
                                    <span className="text-white font-medium">
                                        {rating === 0 ? "Select Rating" : `${rating} Star${rating !== 1 ? 's' : ''}`}
                                    </span>
                                </div>
                                <div className="flex justify-center mb-3">
                                    <StarRating rating={rating} onRatingChange={setRating} editable={true} />
                                </div>
                                {rating > 0 && (
                                    <div className="text-center">
                                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                                            rating === 1 ? 'bg-red-500/20 text-red-300' :
                                            rating === 2 ? 'bg-orange-500/20 text-orange-300' :
                                            rating === 3 ? 'bg-yellow-500/20 text-yellow-300' :
                                            rating === 4 ? 'bg-blue-500/20 text-blue-300' :
                                            'bg-green-500/20 text-green-300'
                                        }`}>
                                            {rating === 1 && "Poor Experience"}
                                            {rating === 2 && "Fair Experience"}
                                            {rating === 3 && "Good Experience"}
                                            {rating === 4 && "Very Good Experience"}
                                            {rating === 5 && "Excellent Experience"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comment Section */}
                        <div>
                            <label className="block text-sm font-medium text-blue-200 mb-2">
                                Your Review
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <MessageCircle className="w-5 h-5 text-slate-400" />
                                </div>
                                <textarea
                                    rows="4"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    maxLength={500}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none"
                                    placeholder="Update your review details..."
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-slate-400">Share your updated thoughts</span>
                                <span className="text-xs text-slate-400">{comment.length}/500</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-white/20">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || rating === 0}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Update Guidelines */}
                    <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="text-white font-medium text-sm mb-2 flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span>Review Tips</span>
                        </h4>
                        <ul className="text-slate-300 text-xs space-y-1 leading-relaxed">
                            <li>• Update your rating if your experience has changed</li>
                            <li>• Add more details to help other customers</li>
                            <li>• Keep your feedback honest and constructive</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditReviewModal;