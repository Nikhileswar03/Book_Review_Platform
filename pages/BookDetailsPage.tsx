
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import type { BookWithReviews, Review } from '../types';
import { useAuth } from '../hooks/useAuth';
import { StarRating } from '../components/StarRating';
import { RatingChart } from '../components/RatingChart';

const ReviewCard: React.FC<{ review: Review, onDelete: (id: string) => void }> = ({ review, onDelete }) => {
    const { user, token } = useAuth();
    return (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{review.userName}</p>
                    <StarRating rating={review.rating} readOnly />
                </div>
                {user?.id === review.userId && (
                    <button onClick={() => onDelete(review.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{review.reviewText}</p>
        </div>
    );
};

const ReviewForm: React.FC<{ bookId: string, onReviewAdded: (review: Review) => void }> = ({ bookId, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [error, setError] = useState('');
    const { user, token, isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
        return <p className="text-gray-600 dark:text-gray-300 text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">Log in</Link> to leave a review.
        </p>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || !reviewText.trim() || !user || !token) {
            setError('Please provide a rating and a review.');
            return;
        }
        setError('');
        try {
            const newReview = await mockApi.addReview({ bookId, userId: user.id, rating, reviewText }, token);
            onReviewAdded(newReview);
            setRating(0);
            setReviewText('');
        } catch (err) {
            setError('Failed to submit review.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Write a Review</h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Your Rating</label>
                <StarRating rating={rating} setRating={setRating} />
            </div>
            <div className="mb-4">
                <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={4}
                    placeholder="Share your thoughts..."
                ></textarea>
            </div>
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Submit Review</button>
        </form>
    );
};


const BookDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<BookWithReviews | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const fetchBook = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await mockApi.getBookById(id);
            setBook(data);
        } catch (err) {
            setError('Failed to fetch book details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBook();
    }, [fetchBook]);
    
    const handleReviewAdded = (newReview: Review) => {
        if(book){
           const updatedReviews = [newReview, ...book.reviews];
           const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
           const averageRating = updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;
           setBook({ ...book, reviews: updatedReviews, averageRating });
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!token || !book) return;
        if(window.confirm("Are you sure you want to delete this review?")) {
            try {
                await mockApi.deleteReview(reviewId, token);
                const updatedReviews = book.reviews.filter(r => r.id !== reviewId);
                const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
                const averageRating = updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;
                setBook({ ...book, reviews: updatedReviews, averageRating });
            } catch (err) {
                alert('Failed to delete review.');
            }
        }
    };

    const handleDeleteBook = async () => {
        if (!id || !token) return;
         if (window.confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
            try {
                await mockApi.deleteBook(id, token);
                navigate('/');
            } catch (error) {
                alert('Failed to delete book.');
                console.error(error);
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!book) return <div className="text-center py-10">Book not found.</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{book.title}</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">by {book.author}</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{book.year} &bull; {book.genre}</p>
                    </div>
                    {user?.id === book.addedBy && (
                        <div className="flex space-x-2 mt-4 md:mt-0">
                            <Link to={`/edit-book/${book.id}`} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">Edit</Link>
                            <button onClick={handleDeleteBook} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Delete</button>
                        </div>
                    )}
                </div>
                <div className="flex items-center my-4">
                    <StarRating rating={book.averageRating} readOnly />
                    <span className="text-gray-600 dark:text-gray-400 ml-3 text-lg">
                        {book.averageRating.toFixed(1)} ({book.reviews.length} reviews)
                    </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">{book.description}</p>

                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Ratings & Reviews</h2>
                    <RatingChart reviews={book.reviews} />
                    <ReviewForm bookId={book.id} onReviewAdded={handleReviewAdded} />
                    <div className="mt-8">
                        {book.reviews.length > 0 ? (
                            book.reviews.map(review => <ReviewCard key={review.id} review={review} onDelete={handleDeleteReview}/>)
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailsPage;
