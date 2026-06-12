/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Dimensions, Image, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';

const AnimatedLine = Animated.createAnimatedComponent(Line);

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const SORA_SIZE = 400;

// SVG 오프셋: imageContainer 좌상단이 화면 내 어디에 있는지 계산
const SVG_OFFSET_X = (SCREEN_W - SORA_SIZE) / 2;
const SVG_OFFSET_Y = (SCREEN_H - SORA_SIZE) / 2;
const GRIP_SIZE = 60;
const GRIP_INITIAL_TOP = 75;
const GRIP_INITIAL_RIGHT = 40;

// grip 초기 왼쪽 상단 (imageContainer 기준)
const GRIP_LEFT = SORA_SIZE - GRIP_INITIAL_RIGHT - GRIP_SIZE;
const GRIP_TOP = GRIP_INITIAL_TOP;

// 고정점: grip 초기 위치의 왼쪽 아래
const ANCHOR_X = GRIP_LEFT + 18;
const ANCHOR_Y = GRIP_TOP + GRIP_SIZE;

// 이동점 초기값: grip 초기 위치의 중앙
const GRIP_CENTER_X = GRIP_LEFT + GRIP_SIZE / 2;
const GRIP_CENTER_Y = GRIP_TOP + GRIP_SIZE / 2;

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0, { damping: 12, stiffness: 120 });
      translateY.value = withSpring(0, { damping: 12, stiffness: 120 });
    });

  const gripStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const lineProps = useAnimatedProps(() => ({
    x1: String(ANCHOR_X + SVG_OFFSET_X),
    y1: String(ANCHOR_Y + SVG_OFFSET_Y),
    x2: String(GRIP_CENTER_X + translateX.value + SVG_OFFSET_X),
    y2: String(GRIP_CENTER_Y + translateY.value + SVG_OFFSET_Y),
  }));

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.container}>
          {/* 레이어 1: 소라고동 */}
          <View style={styles.imageContainer}>
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
            x1={ANCHOR_X + SVG_OFFSET_X}
            y1={ANCHOR_Y + SVG_OFFSET_Y}
            x2={GRIP_CENTER_X + SVG_OFFSET_X}
            y2={GRIP_CENTER_Y + SVG_OFFSET_Y}
            animatedProps={lineProps}
            stroke="#8B7D6B"
            strokeWidth={3}
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
