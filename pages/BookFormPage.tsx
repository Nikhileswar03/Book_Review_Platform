import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { mockApi } from '../services/mockApi';
import type { Book } from '../types';
import { Spinner, BookFormSkeleton } from '../components/Loaders';

const BookFormPage: React.FC<{ mode: 'add' | 'edit' }> = ({ mode }) => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [year, setYear] = useState<number | ''>('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (mode === 'edit' && id) {
            setPageLoading(true);
            mockApi.getBookById(id)
                .then(book => {
                    if (book.addedBy !== user?.id) {
                        setError('You are not authorized to edit this book.');
                        return;
                    }
                    setTitle(book.title);
                    setAuthor(book.author);
                    setDescription(book.description);
                    setGenre(book.genre);
                    setYear(book.year);
                    setCoverImageUrl(book.coverImageUrl || '');
                })
                .catch(() => setError('Failed to load book data.'))
                .finally(() => setPageLoading(false));
        } else {
             setPageLoading(false);
        }
    }, [id, mode, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !token) {
            setError('You must be logged in.');
            return;
        }
        if (!title || !author || !description || !genre || year === '') {
            setError('All fields are required.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            if (mode === 'add') {
                const newBookData: Omit<Book, 'id'> = { title, author, description, genre, year: Number(year), addedBy: user.id, coverImageUrl };
                const newBook = await mockApi.addBook(newBookData, token);
                navigate(`/book/${newBook.id}`);
            } else if (mode === 'edit' && id) {
                const updatedBookData: Partial<Book> = { title, author, description, genre, year: Number(year), coverImageUrl };
                await mockApi.updateBook(id, updatedBookData, token);
                navigate(`/book/${id}`);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <BookFormSkeleton />;

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {mode === 'add' ? 'Add a New Book' : 'Edit Book'}
                </h1>
                {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                        <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                     <div>
                        <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image URL</label>
                        <input type="url" id="coverImageUrl" value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)} placeholder="https://example.com/cover.jpg" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                    </div>
                     <div>
                        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Genre</label>
                        <input type="text" id="genre" value={genre} onChange={e => setGenre(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Published Year</label>
                        <input type="number" id="year" value={year} onChange={e => setYear(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center items-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
                        {loading ? (
                            <>
                                <Spinner size="sm"/>
                                <span className="ml-2">Saving...</span>
                            </>
                        ) : (mode === 'add' ? 'Add Book' : 'Update Book')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookFormPage;