/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Dimensions, Image, LayoutChangeEvent, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import { useCallback, useRef } from 'react';

const AnimatedLine = Animated.createAnimatedComponent(Line);

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// 화면 너비 대비 비율로 사이즈 계산 (기준: 400/화면너비)
const SORA_RATIO = 0.85;
const SORA_SIZE = Math.round(Math.min(SCREEN_W, SCREEN_H) * SORA_RATIO);

// 모든 수치를 SORA_SIZE 비율로 계산 (기존 기준: SORA_SIZE=400)
const GRIP_SIZE = Math.round(SORA_SIZE * (60 / 400));
const GRIP_INITIAL_TOP = Math.round(SORA_SIZE * (75 / 400));
const GRIP_INITIAL_RIGHT = Math.round(SORA_SIZE * (40 / 400));

// grip 초기 왼쪽 상단 (imageContainer 기준)
const GRIP_LEFT = SORA_SIZE - GRIP_INITIAL_RIGHT - GRIP_SIZE;
const GRIP_TOP = GRIP_INITIAL_TOP;

// 고정점: grip 초기 위치의 왼쪽 아래 (기존 +18 오프셋도 비율로)
const ANCHOR_X = GRIP_LEFT + Math.round(SORA_SIZE * (18 / 400));
const ANCHOR_Y = GRIP_TOP + GRIP_SIZE;

// 이동점 초기값: grip 초기 위치의 중앙 (기존 +20 오프셋도 비율로)
const GRIP_CENTER_X = GRIP_LEFT + GRIP_SIZE / 2;
const GRIP_CENTER_Y = GRIP_TOP + GRIP_SIZE / 2 + Math.round(SORA_SIZE * (20 / 400));

// container가 화면 중앙 정렬이므로 오프셋 계산
const OFFSET_X = (SCREEN_W - SORA_SIZE) / 2;
const OFFSET_Y = (SCREEN_H - SORA_SIZE) / 2;

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(OFFSET_X);
  const offsetY = useSharedValue(OFFSET_Y);
  const containerRef = useRef<View>(null);

  const onContainerLayout = useCallback(() => {
    containerRef.current?.measureInWindow((x, y) => {
      offsetX.value = x;
      offsetY.value = y;
    });
  }, [offsetX, offsetY]);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      // damping: 감쇠 (클수록 빨리 멈춤)
      // stiffness: 탄성 (클수록 빠르게 복귀)
      translateX.value = withSpring(0, { damping: 40, stiffness: 80 });
      translateY.value = withSpring(0, { damping: 40, stiffness: 80 });
    });

  const gripStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const lineProps = useAnimatedProps(() => ({
    x1: String(ANCHOR_X + offsetX.value),
    y1: String(ANCHOR_Y + offsetY.value),
    x2: String(GRIP_CENTER_X + translateX.value + offsetX.value),
    y2: String(GRIP_CENTER_Y + translateY.value + offsetY.value),
  }));

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.container}>
          {/* 레이어 1: 소라고동 */}
          <View
            ref={containerRef}
            style={styles.imageContainer}
            onLayout={onContainerLayout}>
            <Image
              source={require('./assets/images/sora.png')}
              style={styles.soraImage}
              resizeMode="contain"
            />
          </View>
        </View>
        {/* 레이어 2: 선 (소라고동 위, grip 아래) */}
        <Svg
          width={SCREEN_W}
          height={SCREEN_H}
          style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
          pointerEvents="none">
          <AnimatedLine
            x1={ANCHOR_X + OFFSET_X}
            y1={ANCHOR_Y + OFFSET_Y}
            x2={GRIP_CENTER_X + OFFSET_X}
            y2={GRIP_CENTER_Y + OFFSET_Y}
            animatedProps={lineProps}
            stroke="#8B7D6B"
            strokeWidth={Math.max(2, Math.round(SORA_SIZE * (3 / 400)))}
            strokeLinecap="round"
          />
        </Svg>
        {/* 레이어 3: grip (최상단) */}
        <View style={[StyleSheet.absoluteFill, styles.gripLayer]} pointerEvents="box-none">
          <View style={styles.imageContainer} pointerEvents="box-none">
            <GestureDetector gesture={gesture}>
              <Animated.View style={[styles.gripWrapper, gripStyle]}>
                <Image
                  source={require('./assets/images/grip.png')}
                  style={styles.gripImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </GestureDetector>
          </View>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    position: 'relative',
    width: SORA_SIZE,
    height: SORA_SIZE,
    overflow: 'visible',
  },
  soraImage: {
    width: SORA_SIZE,
    height: SORA_SIZE,
  },
  gripWrapper: {
    position: 'absolute',
    top: GRIP_INITIAL_TOP,
    right: GRIP_INITIAL_RIGHT,
  },
  gripImage: {
    width: GRIP_SIZE,
    height: GRIP_SIZE,
  },
  gripLayer: {
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
