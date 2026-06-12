import { createContext, useContext, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';

export type BackgroundOption = {
  key: string;
  label: string;
  source: ImageSourcePropType | null; // null = 단색 기본 배경
};

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  { key: 'default', label: '기본', source: null },
  { key: 'beach', label: '해변', source: require('../../assets/images/bg_beach.png') },
  { key: 'sea', label: '바다', source: require('../../assets/images/bg_sea.png') },
  { key: 'space', label: '우주', source: require('../../assets/images/bg_space.png') },
];

type BackgroundContextType = {
  background: BackgroundOption;
  setBackground: (bg: BackgroundOption) => void;
};

const BackgroundContext = createContext<BackgroundContextType>({
  background: BACKGROUND_OPTIONS[0],
  setBackground: () => {},
});

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [background, setBackground] = useState<BackgroundOption>(BACKGROUND_OPTIONS[0]);

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  return useContext(BackgroundContext);
}
