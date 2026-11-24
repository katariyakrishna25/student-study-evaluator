import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Award,
  TrendingUp,
  Cpu,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Backend endpoint on Render
const BACKEND_API_URL = 'https://studyhours-result.onrender.com/predresult';

export default function StudyForm() {
  const [studyHours, setStudyHours] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalStatusText, setEvalStatusText] = useState('Evaluating...');

  const handleInputChange = (e) => {
    setStudyHours(e.target.value);
    if (error) setError('');
  };

  const handleFormSubmit = async (e) => {
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
      setError('Study hours cannot be negative. Please enter 0 or greater.');
      return;
    }

    if (hours > 24) {
      setError('Study hours cannot exceed 24 hours in a single day.');
      return;
    }

    setIsEvaluating(true);
    setEvalStatusText('Querying AI Backend API...');

    try {
      // First attempt: call Render Backend API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for cold start

      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ StudyHours: hours }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }

      const data = await response.json();
      // Expected backend response:
      // { "StudyHours": 7.0, "Probability": 0.88, "Threshold": 0.5, "Result": "Pass" }
      const isPass = (data.Result || '').toLowerCase() === 'pass';
      const probPercent = typeof data.Probability === 'number'
        ? Math.round(data.Probability * 100)
        : (isPass ? 85 : 35);
      const thresholdPercent = typeof data.Threshold === 'number'
        ? Math.round(data.Threshold * 100)
        : 50;

      setResult({
        hours: data.StudyHours ?? hours,
        isPass: isPass,
        probability: probPercent,
        threshold: thresholdPercent,
        rawResult: data.Result || (isPass ? 'Pass' : 'Fail'),
        source: 'Render Live Backend API',
        title: isPass ? 'Result: PASS' : 'Result: FAIL',
        message: isPass
          ? `Congratulations! With ${hours} daily study hours, the AI model predicts a ${probPercent}% pass probability (threshold: ${thresholdPercent}%), projecting the student will PASS.`
          : `Needs Improvement! With ${hours} daily study hours, the AI model projects a ${probPercent}% pass probability, which falls below the ${thresholdPercent}% passing threshold.`,
        tip: isPass
          ? 'Exceptional dedication! Maintain consistent daily study to secure top honors.'
          : 'Recommendation: Increase daily study hours toward 6.0+ hrs to elevate pass probability.'
      });

      if (isPass) {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#6EE7B7', '#3B82F6', '#F59E0B']
        });
      }
    } catch (apiError) {
      console.warn('Backend API request notice:', apiError);

      // Fallback calculation in case Render free instance is waking up or browser CORS requires allowance
      const fallbackPassThreshold = 5.5; // Model threshold is approx 5.5h (5h gave 0.41, 7h gave 0.88)
      const isPass = hours >= fallbackPassThreshold;
      const estimatedProb = Math.min(Math.max(Math.round(100 / (1 + Math.exp(-1.1 * (hours - 5.5)))), 5), 98);

      setResult({
        hours: hours,
        isPass: isPass,
        probability: estimatedProb,
        threshold: 50,
        rawResult: isPass ? 'Pass' : 'Fail',
        source: 'Estimated Outcome (Backend waking up or CORS check)',
        corsNotice: 'Note: Ensure your FastAPI backend has CORSMiddleware enabled so browser requests connect seamlessly.',
        title: isPass ? 'Result: PASS' : 'Result: FAIL',
        message: isPass
          ? `With ${hours} daily study hours, the model projects an estimated ${estimatedProb}% pass probability, predicting the student will PASS.`
          : `With ${hours} daily study hours, the model projects an estimated ${estimatedProb}% pass probability, falling below the 50% passing threshold.`,
        tip: isPass
          ? 'Good study regimen! Continue practicing past exam papers.'
          : 'Increase daily revision hours to push your projected score above 50%.'
      });

      if (isPass) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } finally {
      setIsEvaluating(false);
    }
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
            <Cpu size={15} />
            <span>AI Predictive Model • Render Hosted</span>
          </div>
          <h2 className="card-title">Student Study Hours & Outcome</h2>
          <p className="card-subtitle">
            Enter daily study hours to run real-time inference via your live FastAPI backend.
          </p>
        </div>

        {/* The Single Form */}
        <form className="study-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="studyHoursInput" className="form-label">
              <span>Enter Student Study Hours:</span>
              <span className="label-subtext">0 - 24 hrs</span>
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
                placeholder="e.g. 6.0"
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
                  {evalStatusText}
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

        {/* Quick Suggestion Presets based on your ML Model */}
        <div className="presets-container">
          <span className="presets-label">Quick Test Presets:</span>
          <div className="preset-buttons">
            <button
              type="button"
              className="preset-tag"
              onClick={() => { setStudyHours('2.0'); setError(''); }}
            >
              2.0 hrs (Fail ~ 2%)
            </button>
            <button
              type="button"
              className="preset-tag"
              onClick={() => { setStudyHours('5.0'); setError(''); }}
            >
              5.0 hrs (Borderline ~ 41%)
            </button>
            <button
              type="button"
              className="preset-tag"
              onClick={() => { setStudyHours('7.0'); setError(''); }}
            >
              7.0 hrs (Pass ~ 88%)
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
                  <CheckCircle2 size={34} className="icon-success" />
                ) : (
                  <XCircle size={34} className="icon-fail" />
                )}
              </div>
              <div className="result-headings">
                <div className="badges-row">
                  <span className={`status-pill ${result.isPass ? 'pill-pass' : 'pill-fail'}`}>
                    {result.isPass ? 'PASSED' : 'FAILED'}
                  </span>
                  <span className="source-badge">
                    <Cpu size={12} />
                    {result.source}
                  </span>
                </div>
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
                      Model Pass Probability
                    </span>
                    <span className="metric-value">
                      <strong>{result.probability}%</strong> (Threshold: {result.threshold}%)
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className={`progress-bar-fill ${result.isPass ? 'fill-pass' : 'fill-fail'}`}
                      style={{ width: `${result.probability}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="result-tip-box">
                <strong>Advisory Note:</strong> {result.tip}
              </div>

              {result.corsNotice && (
                <div className="cors-info-box">
                  <Info size={15} />
                  <span>{result.corsNotice}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
