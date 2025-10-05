import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import type { BookWithReviews } from '../types';
import { StarRating } from '../components/StarRating';
import Pagination from '../components/Pagination';
import { BookCardSkeleton } from '../components/Loaders';
import { useDebounce } from '../hooks/useDebounce';

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

const BookCard: React.FC<{ book: BookWithReviews }> = ({ book }) => (
    <Link 
        to={`/book/${book.id}`} 
        className="block group w-full aspect-[2/3] [perspective:1000px]"
        aria-label={`View details for ${book.title}`}
    >
        <div className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:[transform:translateY(-12px)_rotateX(10deg)_rotateY(-30deg)] group-focus-within:[transform:translateY(-12px)_rotateX(10deg)_rotateY(-30deg)]">
            
            {/* Front Cover */}
            <div className={`absolute w-full h-full overflow-hidden rounded-r-md rounded-l-sm [transform:translateZ(12px)] [backface-visibility:hidden] shadow-lg group-hover:shadow-2xl flex flex-col justify-center items-center p-6 text-center text-white ${getBookCoverColor(book.genre)}`}>
                <div className="border-2 border-white/50 p-4 w-full h-full flex flex-col justify-center rounded-sm">
                    <h3 className="text-xl font-bold leading-tight tracking-tight line-clamp-4">{book.title}</h3>
                    <div className="my-2 border-b border-white/50 w-1/4 mx-auto"></div>
                    <p className="text-md opacity-90 line-clamp-3">{book.author}</p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                        <h3 className="text-base font-bold line-clamp-2 leading-tight">{book.title}</h3>
                        <p className="text-xs text-gray-200 mb-1 truncate">by {book.author}</p>
                        <div className="flex items-center" >
                            <div className="[&_svg]:w-4 [&_svg]:h-4">
                                <StarRating rating={book.averageRating} readOnly />
                            </div>
                            <span className="ml-1.5 text-xs">({book.reviews.length} reviews)</span>
                        </div>
                    </div>
                </div>
                {/* Glossy shine effect */}
                <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:left-full transition-all duration-700 ease-in-out" />
            </div>

            {/* Back Cover */}
            <div className="absolute w-full h-full bg-gray-200 dark:bg-gray-800 rounded-r-md rounded-l-sm [transform:rotateY(180deg)_translateZ(12px)] shadow-lg"></div>

            {/* Pages */}
            <div className="absolute top-0 right-0 w-[24px] h-full bg-white dark:bg-gray-200 [transform:rotateY(90deg)_translateX(12px)] [transform-origin:right] shadow-inner"></div>

            {/* Spine */}
            <div className="absolute top-0 left-0 w-[24px] h-full bg-primary-700 dark:bg-primary-900 [transform:rotateY(-90deg)_translateX(-12px)] [transform-origin:left] flex flex-col items-center justify-center rounded-l-md rounded-r-sm shadow-md overflow-hidden p-1">
                <span className="text-white text-xs font-bold [writing-mode:vertical-rl] [text-orientation:mixed] whitespace-nowrap text-ellipsis rotate-180">
                    {book.author}
                </span>
                <span className="text-white text-sm font-bold [writing-mode:vertical-rl] [text-orientation:mixed] whitespace-nowrap text-ellipsis rotate-180 mt-2">
                    {book.title}
                </span>
            </div>
        </div>
    </Link>
);

const HomePage: React.FC = () => {
    const [books, setBooks] = useState<BookWithReviews[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Initialize state from localStorage or use defaults
    const [genre, setGenre] = useState<string>(() => localStorage.getItem('bookFilter_genre') || '');
    const [sortBy, setSortBy] = useState<string>(() => localStorage.getItem('bookFilter_sortBy') || 'rating_desc');

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Persist genre and sort order to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem('bookFilter_genre', genre);
            localStorage.setItem('bookFilter_sortBy', sortBy);
        } catch (error) {
            console.error("Failed to save filter preferences to localStorage:", error);
        }
    }, [genre, sortBy]);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await mockApi.getBooks(currentPage, debouncedSearchTerm, genre, sortBy);
            setBooks(data.books);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('Failed to fetch books.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchTerm, genre, sortBy]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, genre, sortBy]);

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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
                    {[...Array(10)].map((_, i) => <BookCardSkeleton key={i} />)}
                </div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : books.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
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