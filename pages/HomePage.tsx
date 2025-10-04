
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import type { BookWithReviews } from '../types';
import { StarRating } from '../components/StarRating';
import Pagination from '../components/Pagination';

const BookCard: React.FC<{ book: BookWithReviews }> = ({ book }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-1">by {book.author}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">{book.year} &bull; {book.genre}</p>
            <div className="flex items-center mb-4">
                <StarRating rating={book.averageRating} readOnly />
                <span className="text-gray-600 dark:text-gray-400 ml-2">({book.reviews.length} reviews)</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">{book.description}</p>
            <Link to={`/book/${book.id}`} className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
                View Details &rarr;
            </Link>
        </div>
    </div>
);

const HomePage: React.FC = () => {
    const [books, setBooks] = useState<BookWithReviews[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [genre, setGenre] = useState('');
    const [sortBy, setSortBy] = useState('rating_desc');

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await mockApi.getBooks(currentPage, searchTerm, genre, sortBy);
            setBooks(data.books);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('Failed to fetch books.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, genre, sortBy]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, genre, sortBy]);

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">Discover Your Next Read</h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">Browse our collection of books and reviews.</p>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">All Genres</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Dystopian">Dystopian</option>
                    <option value="Classic">Classic</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Romance">Romance</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="rating_desc">Sort by Rating (High to Low)</option>
                    <option value="rating_asc">Sort by Rating (Low to High)</option>
                    <option value="year_desc">Sort by Year (Newest First)</option>
                    <option value="year_asc">Sort by Year (Oldest First)</option>
                </select>
            </div>
            
            {loading ? (
                <div className="text-center text-gray-600 dark:text-gray-300">Loading books...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : books.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {books.map(book => <BookCard key={book.id} book={book} />)}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            ) : (
                <div className="text-center text-gray-600 dark:text-gray-300 mt-12">No books found.</div>
            )}
        </div>
    );
};

export default HomePage;
