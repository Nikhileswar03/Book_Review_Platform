import type { User, Book, Review, BookWithReviews, ReviewWithBookTitle } from '../types';

// Mock Database
let users: User[] = [
    { id: '1', name: 'Alice', email: 'alice@example.com', password: 'password123' },
];
let books: Book[] = [
    { id: '1', title: 'The Hobbit', author: 'J.R.R. Tolkien', description: 'A fantasy novel.', genre: 'Fantasy', year: 1937, addedBy: '1', coverImageUrl: 'https://covers.openlibrary.org/b/id/10441294-L.jpg' },
    { id: '2', title: '1984', author: 'George Orwell', description: 'A dystopian novel.', genre: 'Dystopian', year: 1949, addedBy: '1', coverImageUrl: 'https://covers.openlibrary.org/b/id/12662369-L.jpg' },
    { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee', description: 'A novel about injustice.', genre: 'Classic', year: 1960, addedBy: '1', coverImageUrl: 'https://covers.openlibrary.org/b/id/10206240-L.jpg' },
    { id: '4', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', description: 'A novel about the American dream.', genre: 'Classic', year: 1925, addedBy: '1', coverImageUrl: 'https://covers.openlibrary.org/b/id/13137910-L.jpg' },
    { id: '5', title: 'Dune', author: 'Frank Herbert', description: 'A science fiction epic.', genre: 'Sci-Fi', year: 1965, addedBy: '1', coverImageUrl: 'https://covers.openlibrary.org/b/id/10074218-L.jpg' },
    { id: '6', title: 'Pride and Prejudice', author: 'Jane Austen', description: 'A romantic novel.', genre: 'Romance', year: 1813, addedBy: '1', coverImageUrl: 'https://covers.openlibrary.org/b/id/12845749-L.jpg' },
];
let reviews: Review[] = [
    { id: '1', bookId: '1', userId: '1', rating: 5, reviewText: 'An absolute classic!', userName: 'Alice' },
    { id: '2', bookId: '1', userId: '1', rating: 4, reviewText: 'A great read for all ages.', userName: 'Alice' },
    { id: '3', bookId: '2', userId: '1', rating: 5, reviewText: 'Chilling and thought-provoking.', userName: 'Alice' },
    { id: '4', bookId: '5', userId: '1', rating: 5, reviewText: 'Mind-bending sci-fi.', userName: 'Alice' },
];

const simulateDelay = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 500));
}

const getPlaceholderUrl = (title: string, size: string = '400x600') => {
    return `https://placehold.co/${size}/3b82f6/ffffff?text=${encodeURIComponent(title)}`;
};


export const mockApi = {
    signup: async (name: string, email: string, password: string): Promise<User> => {
        if (users.find(u => u.email === email)) {
            throw new Error('User with this email already exists.');
        }
        const newUser: User = { id: String(users.length + 1), name, email, password };
        users.push(newUser);
        const { password: _, ...userToReturn } = newUser;
        return simulateDelay(userToReturn);
    },

    login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
        const user = users.find(u => u.email === email);
        if (!user || user.password !== password) {
            throw new Error('Invalid credentials.');
        }
        const { password: _, ...userToReturn } = user;
        return simulateDelay({ user: userToReturn, token: `mock-jwt-token-for-${user.id}` });
    },

    getBooks: async (page: number, searchTerm: string, genre: string, sortBy: string): Promise<{ books: BookWithReviews[], totalPages: number }> => {
        let filteredBooks: Book[] = [...books];

        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filteredBooks = filteredBooks.filter(b => 
                b.title.toLowerCase().includes(lowerCaseSearch) || 
                b.author.toLowerCase().includes(lowerCaseSearch)
            );
        }

        if (genre) {
            filteredBooks = filteredBooks.filter(b => b.genre === genre);
        }

        if (sortBy === 'year_asc') {
            filteredBooks.sort((a, b) => a.year - b.year);
        } else if (sortBy === 'year_desc') {
            filteredBooks.sort((a, b) => b.year - a.year);
        }

        const booksWithReviews = filteredBooks.map(book => {
            const bookReviews = reviews.filter(r => r.bookId === book.id);
            const totalRating = bookReviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = bookReviews.length > 0 ? totalRating / bookReviews.length : 0;
            const bookWithCover = {
                ...book,
                coverImageUrl: book.coverImageUrl || getPlaceholderUrl(book.title)
            };
            return { ...bookWithCover, reviews: bookReviews, averageRating };
        });

        if (sortBy === 'rating_asc') {
            booksWithReviews.sort((a, b) => a.averageRating - b.averageRating);
        } else if (sortBy === 'rating_desc') {
            booksWithReviews.sort((a, b) => b.averageRating - a.averageRating);
        }

        const itemsPerPage = 5;
        const totalPages = Math.ceil(booksWithReviews.length / itemsPerPage);
        const paginatedBooks = booksWithReviews.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        return simulateDelay({ books: paginatedBooks, totalPages });
    },

    getBookById: async (id: string): Promise<BookWithReviews> => {
        const book = books.find(b => b.id === id);
        if (!book) {
            throw new Error('Book not found.');
        }
        const bookReviews = reviews.filter(r => r.bookId === book.id);
        const totalRating = bookReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = bookReviews.length > 0 ? totalRating / bookReviews.length : 0;
        const bookWithCover = {
            ...book,
            coverImageUrl: book.coverImageUrl || getPlaceholderUrl(book.title)
        };
        return simulateDelay({ ...bookWithCover, reviews: bookReviews, averageRating });
    },

    addBook: async (bookData: Omit<Book, 'id'>, token: string): Promise<Book> => {
        const userId = token.replace('mock-jwt-token-for-', '');
        if (!users.find(u => u.id === userId)) throw new Error('Unauthorized');
        
        const newBook: Book = { 
            ...bookData, 
            id: String(books.length + 1),
            coverImageUrl: bookData.coverImageUrl || getPlaceholderUrl(bookData.title)
        };
        books.unshift(newBook);
        return simulateDelay(newBook);
    },

    updateBook: async (id: string, bookData: Partial<Book>, token: string): Promise<Book> => {
        const bookIndex = books.findIndex(b => b.id === id);
        if (bookIndex === -1) throw new Error('Book not found');

        const userId = token.replace('mock-jwt-token-for-', '');
        if (books[bookIndex].addedBy !== userId) throw new Error('Forbidden');

        books[bookIndex] = { ...books[bookIndex], ...bookData };
        return simulateDelay(books[bookIndex]);
    },

    deleteBook: async (id: string, token: string): Promise<void> => {
        const bookIndex = books.findIndex(b => b.id === id);
        if (bookIndex === -1) throw new Error('Book not found');

        const userId = token.replace('mock-jwt-token-for-', '');
        if (books[bookIndex].addedBy !== userId) throw new Error('Forbidden');

        books = books.filter(b => b.id !== id);
        reviews = reviews.filter(r => r.bookId !== id);
        return simulateDelay(undefined);
    },

    addReview: async (reviewData: Omit<Review, 'id' | 'userName'>, token: string): Promise<Review> => {
        const user = users.find(u => u.id === reviewData.userId);
        if (!user || token !== `mock-jwt-token-for-${user.id}`) throw new Error('Unauthorized');

        const newReview: Review = { ...reviewData, id: String(reviews.length + 1), userName: user.name };
        reviews.unshift(newReview);
        return simulateDelay(newReview);
    },
    
    updateReview: async (reviewId: string, updatedData: { rating: number, reviewText: string }, token: string): Promise<Review> => {
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);
        if (reviewIndex === -1) throw new Error('Review not found');

        const userId = token.replace('mock-jwt-token-for-', '');
        if (reviews[reviewIndex].userId !== userId) throw new Error('Forbidden');
        
        reviews[reviewIndex] = { ...reviews[reviewIndex], ...updatedData };
        return simulateDelay(reviews[reviewIndex]);
    },

    deleteReview: async (id: string, token: string): Promise<void> => {
        const reviewIndex = reviews.findIndex(r => r.id === id);
        if (reviewIndex === -1) throw new Error('Review not found');

        const userId = token.replace('mock-jwt-token-for-', '');
        if (reviews[reviewIndex].userId !== userId) throw new Error('Forbidden');

        reviews = reviews.filter(r => r.id !== id);
        return simulateDelay(undefined);
    },

    getUserActivity: async (token: string): Promise<{ userBooks: Book[], userReviews: ReviewWithBookTitle[] }> => {
        const userId = token.replace('mock-jwt-token-for-', '');
        if (!users.find(u => u.id === userId)) throw new Error('Unauthorized');
        
        const userBooks = books.filter(b => b.addedBy === userId).map(book => ({
            ...book,
            coverImageUrl: book.coverImageUrl || getPlaceholderUrl(book.title, '100x150')
        }));
        
        const userReviews = reviews
            .filter(r => r.userId === userId)
            .map(review => {
                const book = books.find(b => b.id === review.bookId);
                return {
                    ...review,
                    bookTitle: book ? book.title : 'Unknown Book'
                };
            });

        return simulateDelay({ userBooks, userReviews });
    }
};