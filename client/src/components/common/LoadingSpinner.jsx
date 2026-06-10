const LoadingSpinner = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '80px 20px'
  }}>
    <div style={{ position: 'relative', width: '48px', height: '48px' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        border: '4px solid #e2e8f0'
      }}></div>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        border: '4px solid transparent',
        borderTopColor: '#6366f1',
        animation: 'spin 0.8s linear infinite',
        position: 'absolute', top: 0, left: 0
      }}></div>
    </div>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingSpinner;
