import React, { useState, useEffect } from 'react';

export default function RequestModal({ isOpen, onClose }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: 'Backend Engineering',
    budget: '$5k - $10k',
    details: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleResetAndClose = () => {
    onClose();
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({
        name: '',
        email: '',
        projectType: 'Backend Engineering',
        budget: '$5k - $10k',
        details: '',
      });
    }, 300);
  };

  return (
    <div
      className={`modal-backdrop ${isOpen ? 'open' : ''}`}
      id="modalBackdrop"
      onClick={(e) => {
        if (e.target.id === 'modalBackdrop') handleResetAndClose();
      }}
    >
      <div className="modal-panel" id="modalPanel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" type="button" aria-label="Close modal" onClick={handleResetAndClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!isSubmitted ? (
          <div>
            <div className="modal-eyebrow">
              <span className="dot" />
              Get in touch
            </div>
            <h3 className="modal-title">Let's build something together.</h3>
            <p className="modal-desc">Have a role, project, or opportunity? Send a message below.</p>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="req-name">Your Name</label>
                <input
                  id="req-name"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Alex Rivera"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="req-email">Your Email</label>
                <input
                  id="req-email"
                  type="email"
                  required
                  className="form-input"
                  placeholder="alex@company.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="req-type">Opportunity Type</label>
                <select
                  id="req-type"
                  className="form-select"
                  value={formState.projectType}
                  onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                >
                  <option>Full-Time Role (Backend / Cloud / AI)</option>

                  <option>Backend Engineering</option>
                  <option>Cloud Infrastructure & DevOps</option>
                  <option>AI Automation & Data Pipeline</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="req-details">Details</label>
                <textarea
                  id="req-details"
                  rows={3}
                  required
                  className="form-textarea"
                  placeholder="Tell me about the role or project..."
                  value={formState.details}
                  onChange={(e) => setFormState({ ...formState, details: e.target.value })}
                />
              </div>

              <button className="pill-btn form-submit" type="submit" disabled={isSubmitting}>
                <span className="pill-inner pill-inner--dark pill-inner--arrow">
                  <span>{isSubmitting ? 'Sending…' : 'Send message'}</span>
                  <span className="pill-arrow-badge">
                    <svg className="arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </button>
            </form>
          </div>
        ) : (
          <div className="modal-success">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h4 className="success-title">Message sent!</h4>
            <p className="success-desc">Thanks for reaching out. I'll get back to you shortly.</p>
            <button className="pill-btn" type="button" onClick={handleResetAndClose}>
              <span className="pill-inner pill-inner--dark pill-inner--no-arrow">Done</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
