import React from 'react';
import { GraduationCap, Sparkles, BookOpen } from 'lucide-react';

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
            <p className="brand-tagline">Academic Performance & Result Predictor</p>
          </div>
        </div>

        <div className="header-status-pill">
          <span className="status-dot"></span>
          <span className="status-text">Official Evaluation Standard</span>
          <span className="badge-tag">Pass Mark: 4.0+ hrs</span>
        </div>
      </div>
    </header>
  );
}
