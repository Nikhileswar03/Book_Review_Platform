
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const BookDetailsPage = lazy(() => import('./pages/BookDetailsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const BookFormPage = lazy(() => import('./pages/BookFormPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));


const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <HashRouter>
                    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                        <Header />
                        <main className="flex-grow">
                             <Suspense fallback={<div className="flex justify-center items-center h-full"><div>Loading page...</div></div>}>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/book/:id" element={<BookDetailsPage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/signup" element={<SignupPage />} />
                                    
                                    <Route element={<ProtectedRoute />}>
                                        <Route path="/add-book" element={<BookFormPage mode="add" />} />
                                        <Route path="/edit-book/:id" element={<BookFormPage mode="edit" />} />
                                        <Route path="/profile" element={<ProfilePage />} />
                                    </Route>

                                    <Route path="*" element={<div className="text-center py-10">404: Page Not Found</div>} />
                                </Routes>
                            </Suspense>
                        </main>
                        <footer className="bg-white dark:bg-gray-800 text-center p-4 text-sm text-gray-500 dark:text-gray-400">
                            © {new Date().getFullYear()} BookWise. All rights reserved.
                        </footer>
                    </div>
                </HashRouter>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
