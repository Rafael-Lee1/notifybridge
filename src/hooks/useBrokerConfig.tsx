
import { useContext } from 'react';
import { BrokerConfigContext } from '@/pages/Index';

/**
 * Hook to access the current broker configuration
 */
export const useBrokerConfig = () => {
  const config = useContext(BrokerConfigContext);
  
  if (!config) {
    throw new Error('useBrokerConfig must be used within a BrokerConfigContext.Provider');
  }
  
  return config;
};
