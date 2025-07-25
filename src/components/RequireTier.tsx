import React from 'react';
import { useTier } from '../hooks/useTier';
import { tiersRank, Tier } from '../config/tiers';
import UpgradeCallout from './UpgradeCallout';

export interface RequireTierProps {
  min: Tier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RequireTier: React.FC<RequireTierProps> = ({ min, children, fallback }) => {
  const tier = useTier();
  if (tiersRank[tier] >= tiersRank[min]) {
    return <>{children}</>;
  }
  if (fallback) {
    return <>{fallback}</>;
  }
  return <UpgradeCallout />;
};

export default RequireTier;
