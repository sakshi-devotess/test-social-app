import React, { createContext, useState, useContext } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

interface StripeKeyContextType {
  publishableKey: string;
  setPublishableKey: React.Dispatch<React.SetStateAction<string>>;
}

const StripeKeyContext = createContext<StripeKeyContextType | undefined>(undefined);

export const StripeKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publishableKey, setPublishableKey] = useState<string>('');
  const contextValue = React.useMemo(
    () => ({ publishableKey, setPublishableKey }),
    [publishableKey, setPublishableKey]
  );

  return (
    <StripeProvider publishableKey={publishableKey}>
      <StripeKeyContext.Provider value={contextValue}>{children}</StripeKeyContext.Provider>
    </StripeProvider>
  );
};

export const useStripeKey = () => {
  return useContext(StripeKeyContext);
};
