
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import type { Book, Review } from '../types';
import { StarRating } from '../components/StarRating';

const ProfilePage: React.FC = () => {
    const [userBooks, setUserBooks] = useState<Book[]>([]);
    const [userReviews, setUserReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, token } = useAuth();

    useEffect(() => {
        const fetchActivity = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const { userBooks: books, userReviews: reviews } = await mockApi.getUserActivity(token);
                setUserBooks(books);
                setUserReviews(reviews);
            } catch (err) {
                setError("Failed to load user activity.");
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [token]);

    if (loading) return <div className="text-center py-10">Loading profile...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{user?.email}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Books You've Added</h2>
                    <div className="space-y-4">
                        {userBooks.length > 0 ? userBooks.map(book => (
                            <div key={book.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                <Link to={`/book/${book.id}`} className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">{book.title}</Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">by {book.author}</p>
                            </div>
                        )) : <p className="text-gray-600 dark:text-gray-300">You haven't added any books yet.</p>}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Your Reviews</h2>
                     <div className="space-y-4">
                        {userReviews.length > 0 ? userReviews.map(review => (
                             <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                <StarRating rating={review.rating} readOnly/>
                                <p className="text-gray-700 dark:text-gray-300 mt-2 italic">"{review.reviewText}"</p>
                                <p className="text-sm text-right text-gray-500 dark:text-gray-400 mt-2">
                                    For <Link to={`/book/${review.bookId}`} className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">Book ID: {review.bookId}</Link>
                                </p>
                            </div>
                        )) : <p className="text-gray-600 dark:text-gray-300">You haven't written any reviews yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
