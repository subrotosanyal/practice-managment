import React, { createContext, useContext, useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { SkinName, SkinConfig } from './types';
import { modern } from './skins/modern';
import { classic } from './skins/classic';

// Feature flag check
const ENABLE_SKINS = import.meta.env.VITE_ENABLE_SKINS === 'true';

// Available skins configuration
export const AVAILABLE_SKINS: SkinConfig[] = [
  {
    name: 'modern',
    label: 'Modern',
    description: 'Clean and minimalist design with vibrant accents',
  },
  {
    name: 'classic',
    label: 'Classic',
    description: 'Traditional design with serif fonts and muted colors',
  },
];

// Get theme by skin name
const getThemeBySkin = (skin: SkinName) => {
  switch (skin) {
    case 'classic':
      return classic;
    case 'modern':
    default:
      return modern;
  }
};

interface SkinContextType {
  currentSkin: SkinName;
  setSkin: (skin: SkinName) => void;
  isEnabled: boolean;
  availableSkins: SkinConfig[];
}

const SkinContext = createContext<SkinContextType | undefined>(undefined);

const STORAGE_KEY = 'pm-skin-preference';

export const SkinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSkin, setCurrentSkin] = useState<SkinName>('modern');

  useEffect(() => {
    if (ENABLE_SKINS) {
      const storedSkin = localStorage.getItem(STORAGE_KEY) as SkinName | null;
      if (storedSkin && AVAILABLE_SKINS.some(skin => skin.name === storedSkin)) {
        setCurrentSkin(storedSkin);
      }
    }
  }, []);

  const setSkin = (skin: SkinName) => {
    if (ENABLE_SKINS) {
      setCurrentSkin(skin);
      localStorage.setItem(STORAGE_KEY, skin);
    }
  };

  const value = {
    currentSkin,
    setSkin,
    isEnabled: ENABLE_SKINS,
    availableSkins: AVAILABLE_SKINS,
  };

  return (
    <SkinContext.Provider value={value}>
      <ChakraProvider theme={getThemeBySkin(currentSkin)}>
        {children}
      </ChakraProvider>
    </SkinContext.Provider>
  );
};

export const useSkin = () => {
  const context = useContext(SkinContext);
  if (context === undefined) {
    throw new Error('useSkin must be used within a SkinProvider');
  }
  return context;
};
