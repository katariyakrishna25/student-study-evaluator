import React from 'react';
import { ShieldCheck, Server, ExternalLink } from 'lucide-react';

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
            Academic assessment system integrated with live FastAPI model on Render.
          </p>
        </div>

        <div className="footer-center">
          <a
            href="https://studyhours-result.onrender.com"
            target="_blank"
            rel="noreferrer"
            className="benchmark-badge"
          >
            <Server size={15} className="text-emerald" />
            <span>API: <strong>studyhours-result.onrender.com</strong></span>
            <ExternalLink size={13} className="api-link-icon" />
          </a>
        </div>

        <div className="footer-right">
          <p className="copyright-text">
            © {currentYear} EduPredict. All rights reserved.
          </p>
          <p className="credit-text">
            Frontend deployed on Render • Built with React.js & Vite
          </p>
        </div>
      </div>
    </footer>
  );
}
