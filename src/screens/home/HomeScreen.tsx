import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { useBackground } from '../../context/BackgroundContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import { useCallback, useRef } from 'react';
import soraImage from '../../../assets/images/sora.png';
import gripImage from '../../../assets/images/grip.png';
import {
  SCREEN_W,
  SCREEN_H,
  SORA_SIZE,
  GRIP_SIZE,
  GRIP_INITIAL_TOP,
  GRIP_INITIAL_RIGHT,
  ANCHOR_X,
  ANCHOR_Y,
  GRIP_CENTER_X,
  GRIP_CENTER_Y,
  OFFSET_X,
  OFFSET_Y,
  LINE_WIDTH,
} from './homeConfig';

const AnimatedLine = Animated.createAnimatedComponent(Line);

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { background } = useBackground();
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
      translateX.value = withSpring(0, { damping: 40, stiffness: 120 });
      translateY.value = withSpring(0, { damping: 40, stiffness: 120 });
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

  const content = (
    <>
      {/* 설정 버튼 */}
      <Pressable
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.settingsIcon}>⚙</Text>
      </Pressable>

      {/* 레이어 1: 소라고동 */}
      <View
        ref={containerRef}
        style={styles.imageContainer}
        onLayout={onContainerLayout}>
        <Image
          source={soraImage}
          style={styles.soraImage}
          resizeMode="contain"
        />
      </View>

      {/* 레이어 2: 선 (소라고동 위, grip 아래) */}
      <Svg
        width={SCREEN_W}
        height={SCREEN_H}
        style={[StyleSheet.absoluteFill, styles.lineLayer]}
        pointerEvents="none">
        <AnimatedLine
          x1={ANCHOR_X + OFFSET_X}
          y1={ANCHOR_Y + OFFSET_Y}
          x2={GRIP_CENTER_X + OFFSET_X}
          y2={GRIP_CENTER_Y + OFFSET_Y}
          animatedProps={lineProps}
          stroke="#8B7D6B"
          strokeWidth={LINE_WIDTH}
          strokeLinecap="round"
        />
      </Svg>

      {/* 레이어 3: grip (최상단) */}
      <View style={[StyleSheet.absoluteFill, styles.gripLayer]} pointerEvents="box-none">
        <View style={styles.imageContainer} pointerEvents="box-none">
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.gripWrapper, gripStyle]}>
              <Image
                source={gripImage}
                style={styles.gripImage}
                resizeMode="contain"
              />
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </>
  );

  if (background.source) {
    return (
      <ImageBackground source={background.source} resizeMode="cover" style={styles.container}>
        {content}
      </ImageBackground>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
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
  lineLayer: {
    zIndex: 1,
  },
  gripLayer: {
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  settingsIcon: {
    fontSize: 28,
    color: '#666',
  },
});
