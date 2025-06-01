import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import './theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { CompanyPage } from './pages/CompanyPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { ConfigPage } from './pages/ConfigPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { Toasts } from './components/Toasts';
import { ListPage } from './pages/ListPage';

function App() {
    return (
        <PrimeReactProvider>
            <HashRouter>
                <Routes>
                    <Route
                        index
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/list"
                        element={
                            <ProtectedRoute>
                                <ListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/company/:cik/:mode?/*"
                        element={
                            <ProtectedRoute>
                                <CompanyPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/config/*"
                        element={
                            <ProtectedRoute>
                                <ConfigPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/analysis/*"
                        element={
                            <ProtectedRoute>
                                <AnalysisPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </HashRouter>
            <Toasts />
        </PrimeReactProvider>
    );
}

export default App;
