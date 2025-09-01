import React, { useState } from "react";
import StarRating from "./StarRating";
import reviewService from "../services/review.service";
import { 
    Star, 
    MessageCircle, 
    Send, 
    AlertCircle,
    CheckCircle,
    RefreshCw,
    Sparkles
} from 'lucide-react';

const AddReview = ({ carId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (rating === 0) {
            setError("Please select a rating to continue.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await reviewService.addReviewForCar(carId, { rating, comment });
            setSuccess("Thank you! Your review has been submitted successfully.");
            setRating(0);
            setComment("");
            onReviewSubmitted(response.data);
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data || "Failed to submit review. Please try again.";
            setError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-700/30 to-slate-800/30 p-6 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Share Your Experience</h3>
                            <p className="text-blue-200 text-sm">Help others by writing a review</p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6">
                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-xl backdrop-blur-sm mb-6">
                            <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium mb-1">Review Submitted!</p>
                                    <p className="text-sm">{success}</p>
                                </div>
                            </div>
                        </div>
                    )}

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
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <Star className="w-5 h-5 text-yellow-400" />
                                    <span className="text-white font-medium">
                                        {rating === 0 ? "Select Rating" : `${rating} Star${rating !== 1 ? 's' : ''}`}
                                    </span>
                                </div>
                                <div className="flex justify-center">
                                    <StarRating rating={rating} onRatingChange={setRating} editable={true} />
                                </div>
                                {rating > 0 && (
                                    <div className="text-center mt-2">
                                        <span className="text-xs text-slate-300">
                                            {rating === 1 && "Poor"}
                                            {rating === 2 && "Fair"}
                                            {rating === 3 && "Good"}
                                            {rating === 4 && "Very Good"}
                                            {rating === 5 && "Excellent"}
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
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none"
                                    placeholder="Share details about your experience with this car..."
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-slate-400">Optional but helpful</span>
                                <span className="text-xs text-slate-400">{comment.length}/500</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || rating === 0}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    <span>Submitting Review...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Submit Review</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Review Guidelines */}
                    <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="text-white font-medium text-sm mb-2 flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span>Review Guidelines</span>
                        </h4>
                        <ul className="text-slate-300 text-xs space-y-1 leading-relaxed">
                            <li>• Be honest and constructive in your feedback</li>
                            <li>• Focus on the car's condition, performance, and service</li>
                            <li>• Help other customers make informed decisions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddReview;