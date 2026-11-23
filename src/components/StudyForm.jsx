import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, RotateCcw, Award, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudyForm() {
  const [studyHours, setStudyHours] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Passing threshold: 4.0 hours
  const PASS_THRESHOLD = 4.0;

  const handleInputChange = (e) => {
    setStudyHours(e.target.value);
    if (error) setError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    // Validation
    const trimmedInput = studyHours.trim();
    if (trimmedInput === '') {
      setError('Please enter the student study hours before checking.');
      return;
    }

    const hours = parseFloat(trimmedInput);
    if (isNaN(hours)) {
      setError('Please enter a valid numeric value for study hours.');
      return;
    }

    if (hours < 0) {
      setError('Study hours cannot be negative. Please enter a value of 0 or greater.');
      return;
    }

    if (hours > 24) {
      setError('Study hours cannot exceed 24 hours in a single day.');
      return;
    }

    // Processing evaluation with subtle animation delay for realistic UX
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);
      const isPass = hours >= PASS_THRESHOLD;

      // Calculate readiness score (estimate percentage up to 100%)
      const readinessScore = Math.min(Math.round((hours / 8.0) * 100), 100);

      setResult({
        hours: hours,
        isPass: isPass,
        score: readinessScore,
        title: isPass ? 'Result: PASS' : 'Result: FAIL',
        message: isPass
          ? `Great Job! With ${hours} hour${hours === 1 ? '' : 's'} of dedicated study, the student meets the qualification standard and is predicted to PASS.`
          : `Needs Improvement! With only ${hours} hour${hours === 1 ? '' : 's'} of study, the student falls below the required ${PASS_THRESHOLD} hours benchmark and is predicted to FAIL.`,
        tip: isPass
          ? 'Maintain this consistent study habit to secure top academic honors!'
          : `Increase study time by at least ${(PASS_THRESHOLD - hours).toFixed(1)} more hours daily to achieve passing status.`
      });

      if (isPass) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#6EE7B7', '#3B82F6', '#F59E0B']
        });
      }
    }, 350);
  };

  const handleReset = () => {
    setStudyHours('');
    setResult(null);
    setError('');
  };

  return (
    <section className="form-wrapper">
      <div className="card-container">
        {/* Card Header */}
        <div className="card-header">
          <div className="badge-chip">
            <Award size={15} />
            <span>Academic Performance Assessment</span>
          </div>
          <h2 className="card-title">Check Student Pass / Fail Status</h2>
          <p className="card-subtitle">
            Enter the student's daily study hours below to calculate their examination outcome.
          </p>
        </div>

        {/* The Single Form */}
        <form className="study-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="studyHoursInput" className="form-label">
              Enter Student Study Hours:
            </label>
            
            <div className={`input-field-wrapper ${error ? 'input-error' : ''}`}>
              <div className="input-prefix-icon">
                <Clock size={20} />
              </div>
              <input
                id="studyHoursInput"
                type="number"
                step="0.1"
                min="0"
                max="24"
                placeholder="e.g. 5.5"
                value={studyHours}
                onChange={handleInputChange}
                className="form-text-input"
                autoComplete="off"
              />
              <span className="input-unit">Hours / Day</span>
            </div>

            {error && (
              <div className="error-message">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className={`submit-button ${isEvaluating ? 'loading' : ''}`}
              disabled={isEvaluating}
            >
              {isEvaluating ? (
                <span className="btn-loader-text">
                  <span className="spinner"></span>
                  Evaluating...
                </span>
              ) : (
                <span className="btn-content">
                  <span>Check Result</span>
                  <ArrowRight size={18} />
                </span>
              )}
            </button>

            {(result || studyHours) && (
              <button
                type="button"
                onClick={handleReset}
                className="reset-button"
                title="Clear and reset form"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </form>

        {/* Quick Suggestion Presets */}
        <div className="presets-container">
          <span className="presets-label">Quick Test Values:</span>
          <div className="preset-buttons">
            <button
              type="button"
              className="preset-tag"
              onClick={() => { setStudyHours('2'); setError(''); }}
            >
              2.0 hrs (Low)
            </button>
            <button
              type="button"
              className="preset-tag"
              onClick={() => { setStudyHours('4.0'); setError(''); }}
            >
              4.0 hrs (Threshold)
            </button>
            <button
              type="button"
              className="preset-tag"
              onClick={() => { setStudyHours('6.5'); setError(''); }}
            >
              6.5 hrs (High)
            </button>
          </div>
        </div>

        {/* Result Display Box */}
        {result && (
          <div
            className={`result-card ${
              result.isPass ? 'result-pass' : 'result-fail'
            }`}
          >
            <div className="result-header">
              <div className="result-icon-box">
                {result.isPass ? (
                  <CheckCircle2 size={32} className="icon-success" />
                ) : (
                  <XCircle size={32} className="icon-fail" />
                )}
              </div>
              <div className="result-headings">
                <span className={`status-pill ${result.isPass ? 'pill-pass' : 'pill-fail'}`}>
                  {result.isPass ? 'PASSED' : 'FAILED'}
                </span>
                <h3 className="result-main-title">{result.title}</h3>
              </div>
            </div>

            <div className="result-body">
              <p className="result-message">{result.message}</p>
              
              <div className="result-metrics">
                <div className="metric-row">
                  <div className="metric-info">
                    <span className="metric-label">
                      <TrendingUp size={16} />
                      Academic Preparedness Score
                    </span>
                    <span className="metric-value">{result.score}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className={`progress-bar-fill ${result.isPass ? 'fill-pass' : 'fill-fail'}`}
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="result-tip-box">
                <strong>Advisory Note:</strong> {result.tip}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
