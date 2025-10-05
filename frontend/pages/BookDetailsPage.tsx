import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import type { BookWithReviews, Review } from '../types';
import { useAuth } from '../hooks/useAuth';
import { StarRating } from '../components/StarRating';
import { RatingChart } from '../components/RatingChart';
import { BookDetailsSkeleton } from '../components/Loaders';
import { Modal } from '../components/Modal';

const getBookCoverColor = (genre: string): string => {
    const genreColors: { [key: string]: string } = {
        'Fantasy': 'bg-indigo-600 dark:bg-indigo-800',
        'Dystopian': 'bg-slate-600 dark:bg-slate-800',
        'Classic': 'bg-amber-700 dark:bg-amber-900',
        'Sci-Fi': 'bg-cyan-600 dark:bg-cyan-800',
        'Romance': 'bg-rose-600 dark:bg-rose-800',
    };
    return genreColors[genre] || 'bg-primary-600 dark:bg-primary-800';
};

const ReviewCard: React.FC<{ 
    review: Review, 
    onRequestDelete: (review: Review) => void,
    editingReviewId: string | null,
    setEditingReviewId: (id: string | null) => void,
    onRequestUpdate: (reviewId: string, rating: number, reviewText: string) => void,
}> = ({ review, onRequestDelete, editingReviewId, setEditingReviewId, onRequestUpdate }) => {
    const { user } = useAuth();
    const isEditing = editingReviewId === review.id;

    const [editedRating, setEditedRating] = useState(review.rating);
    const [editedText, setEditedText] = useState(review.reviewText);

    const handleSave = () => {
        onRequestUpdate(review.id, editedRating, editedText);
    };

    if (isEditing && user?.id === review.userId) {
        return (
            <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg mb-4 border border-primary-500 transition-all duration-300">
                <p className="font-semibold text-gray-800 dark:text-white">{review.userName}</p>
                <div className="my-2">
                    <StarRating rating={editedRating} setRating={setEditedRating} />
                </div>
                <textarea
                    value={editedText}
                    onChange={e => setEditedText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    rows={3}
                ></textarea>
                <div className="flex justify-end space-x-2 mt-2">
                    <button onClick={() => setEditingReviewId(null)} className="text-gray-600 dark:text-gray-300 px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700 transition-colors">Save</button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{review.userName}</p>
                    <StarRating rating={review.rating} readOnly />
                </div>
                {user?.id === review.userId && (
                    <div className="flex space-x-3">
                        <button onClick={() => setEditingReviewId(review.id)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">Edit</button>
                        <button onClick={() => onRequestDelete(review)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                    </div>
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


const BookDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<BookWithReviews | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        confirmText: 'Confirm',
        confirmButtonClass: 'bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500',
    });

    const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

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

    const handleUpdateReview = async (reviewId: string, rating: number, reviewText: string) => {
        if (!token || !book) return;
        try {
            const updatedReview = await mockApi.updateReview(reviewId, { rating, reviewText }, token);
            const updatedReviews = book.reviews.map(r => r.id === reviewId ? updatedReview : r);
            const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;
            setBook({ ...book, reviews: updatedReviews, averageRating });
            setEditingReviewId(null);
        } catch (err) {
            alert('Failed to update review.');
            console.error(err);
        }
    };
    
    const handleReviewUpdateRequest = (reviewId: string, rating: number, reviewText: string) => {
        const performUpdate = () => handleUpdateReview(reviewId, rating, reviewText);
        setModalConfig({
            isOpen: true,
            title: 'Confirm Changes',
            message: 'Are you sure you want to save your changes to this review?',
            onConfirm: performUpdate,
            confirmText: 'Save Changes',
            confirmButtonClass: 'bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500',
        });
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!token || !book) return;
        try {
            await mockApi.deleteReview(reviewId, token);
            const updatedReviews = book.reviews.filter(r => r.id !== reviewId);
            const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;
            setBook({ ...book, reviews: updatedReviews, averageRating });
        } catch (err) {
            alert('Failed to delete review.');
        }
    };
    
    const handleReviewDeleteRequest = (review: Review) => {
        const performDelete = () => handleDeleteReview(review.id);
        setModalConfig({
            isOpen: true,
            title: 'Delete Review',
            message: `Are you sure you want to delete your review for "${book?.title}"?`,
            onConfirm: performDelete,
            confirmText: 'Delete',
            confirmButtonClass: 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500',
        });
    };

    const handleBookDeleteRequest = () => {
        if (!id || !token || !book) return;
        const performDelete = async () => {
            try {
                await mockApi.deleteBook(id, token);
                navigate('/');
            } catch (error) {
                alert('Failed to delete book.');
                console.error(error);
            }
        };
        
        setModalConfig({
            isOpen: true,
            title: `Delete "${book.title}"`,
            message: 'Are you sure you want to delete this book? This action cannot be undone and will delete all associated reviews.',
            onConfirm: performDelete,
            confirmText: 'Delete',
            confirmButtonClass: 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500',
        });
    };

    if (loading) return <BookDetailsSkeleton />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!book) return <div className="text-center py-10">Book not found.</div>;

    return (
        <div className="container mx-auto px-6 py-8">
             <button onClick={() => navigate('/')} className="inline-flex items-center mb-6 text-primary-600 dark:text-primary-400 hover:underline transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
            </button>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                         <div className={`w-full aspect-[2/3] rounded-lg shadow-md flex flex-col justify-center items-center p-8 text-center text-white ${getBookCoverColor(book.genre)}`}>
                            <div className="border-2 border-white/50 p-6 w-full h-full flex flex-col justify-center rounded-md">
                                <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight">{book.title}</h2>
                                <div className="my-4 border-b border-white/50 w-1/4 mx-auto"></div>
                                <p className="text-xl opacity-90">{book.author}</p>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <div className="flex flex-col md:flex-row justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{book.title}</h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">by {book.author}</p>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">{book.year} &bull; {book.genre}</p>
                            </div>
                            {user?.id === book.addedBy && (
                                <div className="flex space-x-2 mt-4 md:mt-0 flex-shrink-0">
                                    <Link to={`/edit-book/${book.id}`} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">Edit</Link>
                                    <button onClick={handleBookDeleteRequest} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Delete</button>
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
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Ratings & Reviews</h2>
                    <RatingChart reviews={book.reviews} />
                    <ReviewForm bookId={book.id} onReviewAdded={handleReviewAdded} />
                    <div className="mt-8">
                        {book.reviews.length > 0 ? (
                            book.reviews.map(review => 
                                <ReviewCard 
                                    key={review.id} 
                                    review={review} 
                                    onRequestDelete={handleReviewDeleteRequest}
                                    editingReviewId={editingReviewId}
                                    setEditingReviewId={setEditingReviewId}
                                    onRequestUpdate={handleReviewUpdateRequest}
                                />
                            )
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>
             <Modal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                confirmText={modalConfig.confirmText}
                confirmButtonClass={modalConfig.confirmButtonClass}
            >
                {modalConfig.message}
            </Modal>
        </div>
    );
};

export default BookDetails;