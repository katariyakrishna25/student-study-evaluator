import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="footer-dot"></span>
            <strong>EduPredict System</strong>
          </div>
          <p className="footer-disclaimer">
            Academic Assessment Platform. Evaluates student performance benchmark based on standard study hours.
          </p>
        </div>

        <div className="footer-center">
          <div className="benchmark-badge">
            <ShieldCheck size={16} className="text-emerald" />
            <span>Pass Threshold Standard: <strong>4.0 Hours/Day</strong></span>
          </div>
        </div>

        <div className="footer-right">
          <p className="copyright-text">
            © {currentYear} EduPredict. All rights reserved.
          </p>
          <p className="credit-text">
            Engineered with React.js & modern UI standards.
          </p>
        </div>
      </div>
    </footer>
  );
}
