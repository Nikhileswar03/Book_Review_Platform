import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import type { Book, ReviewWithBookTitle } from '../types';
import { StarRating } from '../components/StarRating';
import { ProfilePageSkeleton } from '../components/Loaders';
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

const ProfilePage: React.FC = () => {
    const [userBooks, setUserBooks] = useState<Book[]>([]);
    const [userReviews, setUserReviews] = useState<ReviewWithBookTitle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, token } = useAuth();
    
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });

    const closeModal = () => {
        setModalConfig({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    };

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

    const handleDeleteRequest = (book: Book) => {
        if (!token) {
            alert("Authentication error. Please log in again.");
            return;
        }

        const performDelete = async () => {
            try {
                await mockApi.deleteBook(book.id, token);
                setUserBooks(currentBooks => currentBooks.filter(b => b.id !== book.id));
                setUserReviews(currentReviews => currentReviews.filter(r => r.bookId !== book.id));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to delete the book.';
                alert(errorMessage);
                console.error(err);
            }
        };

        setModalConfig({
            isOpen: true,
            title: `Delete "${book.title}"`,
            message: 'Are you sure you want to delete this book? This action cannot be undone and will delete all associated reviews.',
            onConfirm: performDelete,
        });
    };


    if (loading) return <ProfilePageSkeleton />;
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
                           <div 
                                key={book.id} 
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center justify-between gap-4 transition-shadow duration-300 hover:shadow-xl"
                            >
                                <Link to={`/book/${book.id}`} className="flex items-center space-x-4 flex-grow min-w-0 group [perspective:800px]">
                                    <div className="relative w-16 h-24 flex-shrink-0 transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(-25deg)]">
                                        <div className={`absolute w-full h-full rounded-sm overflow-hidden shadow-sm [transform:translateZ(4px)] flex items-center justify-center p-1 text-center text-white ${getBookCoverColor(book.genre)}`}>
                                            <h4 className="text-[8px] font-bold leading-tight line-clamp-5">{book.title}</h4>
                                            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:left-full transition-all duration-700 ease-in-out" />
                                        </div>
                                        <div className="absolute w-full h-full bg-gray-200 dark:bg-gray-600 rounded-sm [transform:rotateY(180deg)_translateZ(4px)]"></div>
                                        <div className="absolute top-0 left-0 w-[8px] h-full bg-primary-700 dark:bg-primary-900 rounded-l-sm [transform:rotateY(-90deg)_translateX(-4px)] [transform-origin:left]"></div>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-primary-600 dark:text-primary-400 group-hover:underline truncate">{book.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">by {book.author}</p>
                                    </div>
                                </Link>
                                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                                    <Link to={`/edit-book/${book.id}`} className="text-center text-sm bg-yellow-500 text-white px-3 py-1.5 rounded-md hover:bg-yellow-600 transition-colors shadow-sm">
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteRequest(book)} 
                                        className="text-sm bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors shadow-sm"
                                        aria-label={`Delete ${book.title}`}
                                    >
                                        Delete
                                    </button>
                                </div>
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
                                    For <Link to={`/book/${review.bookId}`} className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">{review.bookTitle}</Link>
                                </p>
                            </div>
                        )) : <p className="text-gray-600 dark:text-gray-300">You haven't written any reviews yet.</p>}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                confirmText="Delete"
                confirmButtonClass="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
            >
                {modalConfig.message}
            </Modal>
        </div>
    );
};

export default ProfilePage;