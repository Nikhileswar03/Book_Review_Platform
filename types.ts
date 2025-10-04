
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  year: number;
  addedBy: string; // userId
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number; // 1-5
  reviewText: string;
  userName: string;
}

export interface BookWithReviews extends Book {
  reviews: Review[];
  averageRating: number;
}
