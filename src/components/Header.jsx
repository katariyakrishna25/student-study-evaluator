import React from 'react';
import { GraduationCap, Server } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-group">
          <div className="logo-icon-wrapper">
            <GraduationCap className="logo-icon" size={28} />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">
              Edu<span>Predict</span>
            </h1>
            <p className="brand-tagline">AI Student Academic Outcome Predictor</p>
          </div>
        </div>

        <div className="header-status-pill">
          <span className="status-dot"></span>
          <Server size={14} className="api-icon" />
          <span className="status-text">Backend Connected:</span>
          <a
            href="https://studyhours-result.onrender.com"
            target="_blank"
            rel="noreferrer"
            className="backend-link-pill"
          >
            studyhours-result.onrender.com
          </a>
        </div>
      </div>
    </header>
  );
}
