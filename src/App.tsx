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
import { NavigateEffector } from './components/routes/NavigateEffector';
import { ImpressumPage } from './pages/ImpressumPage';
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

function App() {
    return (
        <PrimeReactProvider>
            <HashRouter>
                <NavigateEffector />
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="/list" element={<ListPage />} />
                    <Route
                        path="/company/:cik/:mode?/*"
                        element={<CompanyPage />}
                    />
                    <Route
                        path="/config/*"
                        element={
                            <ProtectedRoute right="companies.config">
                                <ConfigPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/analysis/*"
                        element={
                            <ProtectedRoute right="companies.missingRequiredData.view">
                                <AnalysisPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/login/:accesstoken?"
                        element={<LoginPage />}
                    />
                    <Route
                        path="/login/forgotpassword"
                        element={<ForgotPasswordPage />}
                    />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/users/password-reset/:token"
                        element={<ResetPasswordPage />}
                    />
                    <Route path="/impressum" element={<ImpressumPage />} />
                    <Route
                        path="/terms-and-conditions"
                        element={<TermsAndConditionsPage />}
                    />
                </Routes>
            </HashRouter>
            <Toasts />
        </PrimeReactProvider>
    );
}

export default App;
