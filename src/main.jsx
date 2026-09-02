import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error('React Error:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          background: '#0a0a0a', color: '#ff4444', padding: '40px',
          fontFamily: 'monospace', fontSize: '14px', minHeight: '100vh'
        }}>
          <h1 style={{ color: '#ff6666', marginBottom: '20px' }}>⚠ Runtime Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#ffaaaa', marginBottom: '20px' }}>
            {this.state.error?.toString()}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#888', fontSize: '12px' }}>
            {this.state.info?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
