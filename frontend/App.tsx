import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/HomePage'));
const BookDetails = lazy(() => import('./pages/BookDetailsPage'));
const Login = lazy(() => import('./pages/LoginPage'));
const Signup = lazy(() => import('./pages/SignupPage'));
const BookForm = lazy(() => import('./pages/BookFormPage'));
const Profile = lazy(() => import('./pages/ProfilePage'));


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
                                    <Route path="/" element={<Home />} />
                                    <Route path="/book/:id" element={<BookDetails />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<Signup />} />
                                    
                                    <Route element={<ProtectedRoute />}>
                                        <Route path="/add-book" element={<BookForm mode="add" />} />
                                        <Route path="/edit-book/:id" element={<BookForm mode="edit" />} />
                                        <Route path="/profile" element={<Profile />} />
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