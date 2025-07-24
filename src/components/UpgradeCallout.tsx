import React from 'react';
import { Link } from 'react-router-dom';

const UpgradeCallout: React.FC = () => {
  return (
    <div className="upgrade-callout" style={{padding: '1rem', border: '1px solid #ddd', borderRadius: '0.5rem', textAlign: 'center'}}>
      <p>You need to upgrade your subscription to access this feature.</p>
      <Link to="/pricing" className="btn btn-primary">Upgrade Now</Link>
    </div>
  );
};

export default UpgradeCallout;
