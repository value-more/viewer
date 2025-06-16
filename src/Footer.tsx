import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => (
    <div className="flex justify-content-center align-items-center gap-5">
        <div>© 2025 - Value More | All rights reserved</div>
        <Link to="/privacy-policy" className="no-underline text-primary">
            Privacy Policy
        </Link>
        <Link to="/impressum" className="no-underline text-primary">
            Impressum
        </Link>
        <Link to="/terms-and-conditions" className="no-underline text-primary">
            Terms and Conditions
        </Link>
    </div>
);
