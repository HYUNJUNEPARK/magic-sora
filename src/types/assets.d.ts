// 이미지 파일을 import 구문으로 사용하기 위한 타입 선언
declare module '*.png' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}
