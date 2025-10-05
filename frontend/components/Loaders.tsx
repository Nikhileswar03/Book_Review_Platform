import React from 'react';

// Spinner for buttons and general loading state
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };
  return (
    <div className={`animate-spin rounded-full border-solid border-current border-t-transparent ${sizeClasses[size]}`} role="status">
        <span className="sr-only">Loading...</span>
    </div>
  );
};

// Skeleton loader for BookCard on HomePage
export const BookCardSkeleton: React.FC = () => (
  <div className="aspect-[2/3] w-full bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
);

// Skeleton loader for BookDetailsPage
export const BookDetailsSkeleton: React.FC = () => (
    <div className="container mx-auto px-6 py-8 animate-pulse">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
            {/* Top section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="w-full pt-[150%] bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                </div>
                <div className="md:col-span-2">
                    <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
                    <div className="h-5 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
                    <div className="flex items-center my-4">
                         <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
                    <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
                </div>
            </div>
            
            {/* Reviews section */}
            <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8">
                 <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                 {/* Chart Skeleton */}
                 <div className="h-64 w-full bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
                 {/* Review Form Skeleton */}
                 <div className="h-8 w-1/4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                 <div className="h-10 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                 <div className="h-24 w-full bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                 <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
        </div>
    </div>
);

// Skeleton loader for BookFormPage (edit mode)
export const BookFormSkeleton: React.FC = () => (
    <div className="container mx-auto px-6 py-8 animate-pulse">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="h-8 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i}>
                        <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                ))}
                <div className="h-12 w-full bg-gray-400 dark:bg-gray-600 rounded mt-6"></div>
            </div>
        </div>
    </div>
);

// Skeleton loader for ProfilePage
export const ProfilePageSkeleton: React.FC = () => (
    <div className="container mx-auto px-6 py-8 animate-pulse">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl mb-8">
            <div className="h-10 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <div className="h-8 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-4">
                            <div className="w-16 h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className="h-8 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-4">
                     {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mt-3"></div>
                            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
                             <div className="flex justify-end mt-2">
                                <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);