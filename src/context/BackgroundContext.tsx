import { createContext, useContext, useState, useEffect } from 'react';
import type { ImageSourcePropType } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'background_key';

export type BackgroundOption = {
  key: string;
  label: string;
  source: ImageSourcePropType | null; // null = 단색 기본 배경
};

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  { key: 'default', label: '', source: null },
  { key: 'beach', label: '해변', source: require('../../assets/images/bg_beach.png') },
  { key: 'sea', label: '바다', source: require('../../assets/images/bg_sea.png') },
  { key: 'deepsea', label: '심해 유적', source: require('../../assets/images/bg_deepsea.png') },
  { key: 'space', label: '우주', source: require('../../assets/images/bg_space.png') },
  { key: 'moon', label: '달빛 호수', source: require('../../assets/images/bg_moon.png') },
  { key: 'heaven', label: '꿈속 구름', source: require('../../assets/images/bg_heaven.png') },
  { key: 'toyroom', label: '장난감 방', source: require('../../assets/images/bg_toyroom.png') },
];

type BackgroundContextType = {
  background: BackgroundOption;
  setBackground: (bg: BackgroundOption) => void;
  isLoaded: boolean;
};

const DEFAULT_BACKGROUND = BACKGROUND_OPTIONS.find((opt) => opt.key === 'sea')!;

const BackgroundContext = createContext<BackgroundContextType>({
  background: DEFAULT_BACKGROUND,
  setBackground: () => {},
  isLoaded: false,
});

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [background, setBackgroundState] = useState<BackgroundOption>(DEFAULT_BACKGROUND);
  const [isLoaded, setIsLoaded] = useState(false);

  // 앱 시작 시 저장된 배경 불러오기
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((savedKey) => {
      if (savedKey) {
        const found = BACKGROUND_OPTIONS.find((opt) => opt.key === savedKey);
        if (found) {
          setBackgroundState(found);
        }
      }
      setIsLoaded(true);
    });
  }, []);

  // 배경 변경 시 저장
  const setBackground = (bg: BackgroundOption) => {
    setBackgroundState(bg);
    AsyncStorage.setItem(STORAGE_KEY, bg.key);
  };

  return (
    <BackgroundContext.Provider value={{ background, setBackground, isLoaded }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  return useContext(BackgroundContext);
}
