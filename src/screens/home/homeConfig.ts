import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// 화면 너비 대비 비율로 사이즈 계산 (기준: 400/화면너비)
const SORA_RATIO = 0.85;
const BASE_SIZE = 400;
const SORA_SIZE = Math.round(Math.min(SCREEN_W, SCREEN_H) * SORA_RATIO);

const scale = (value: number) => Math.round(SORA_SIZE * (value / BASE_SIZE));

// 모든 수치를 SORA_SIZE 비율로 계산
const GRIP_SIZE = scale(60);
const GRIP_INITIAL_TOP = scale(75);
const GRIP_INITIAL_RIGHT = scale(40);

// grip 초기 왼쪽 상단 (imageContainer 기준)
const GRIP_LEFT = SORA_SIZE - GRIP_INITIAL_RIGHT - GRIP_SIZE;
const GRIP_TOP = GRIP_INITIAL_TOP;

// 고정점: grip 초기 위치의 왼쪽 아래
const ANCHOR_X = GRIP_LEFT + scale(18);
const ANCHOR_Y = GRIP_TOP + GRIP_SIZE;

// 이동점 초기값: grip 초기 위치의 중앙
const GRIP_CENTER_X = GRIP_LEFT + GRIP_SIZE / 2;
const GRIP_CENTER_Y = GRIP_TOP + GRIP_SIZE / 2 + scale(20);

// container가 화면 중앙 정렬이므로 오프셋 계산
const OFFSET_X = (SCREEN_W - SORA_SIZE) / 2;
const OFFSET_Y = (SCREEN_H - SORA_SIZE) / 2;

const LINE_WIDTH = Math.max(2, scale(3));

export {
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
};
