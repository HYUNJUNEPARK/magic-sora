import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { BACKGROUND_OPTIONS, useBackground } from '../../context/BackgroundContext';
import soraImage from '../../../assets/images/sora.png';

export default function BackgroundSettingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { background, setBackground } = useBackground();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerSide}>
          <Text style={styles.backText}>‹ 뒤로</Text>
        </Pressable>
        <Text style={styles.headerTitle}>배경 설정</Text>
        <View style={styles.headerSide} />
      </View>

      {/* 미리보기 (모바일 세로형) */}
      <View style={styles.previewWrapper}>
        <View style={styles.previewContainer}>
          {background.source ? (
            <Image source={background.source} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <View style={styles.previewDefault} />
          )}
          <Image source={soraImage} style={styles.previewSora} resizeMode="contain" />
        </View>
      </View>

      {/* 배경 선택 그리드 */}
      <Text style={styles.sectionHeader}>배경 선택</Text>
      <View style={styles.grid}>
        {BACKGROUND_OPTIONS.map((option) => {
          const isSelected = background.key === option.key;
          return (
            <Pressable
              key={option.key}
              style={styles.gridItem}
              onPress={() => setBackground(option)}>
              <View style={[styles.thumbnail, isSelected && styles.thumbnailSelected]}>
                {option.source ? (
                  <Image source={option.source} style={styles.thumbnailImage} resizeMode="cover" />
                ) : (
                  <View style={styles.thumbnailDefault} />
                )}
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.gridLabel}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSide: {
    width: 70,
  },
  backText: {
    fontSize: 17,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  previewWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  previewContainer: {
    width: 140,
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F2F2F7',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C6C6C8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  previewDefault: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F2F2F7',
  },
  previewSora: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  sectionHeader: {
    fontSize: 13,
    color: '#6D6D72',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  gridItem: {
    alignItems: 'center',
  },
  thumbnail: {
    width: 72,
    height: 128,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C6C6C8',
  },
  thumbnailSelected: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailDefault: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  gridLabel: {
    fontSize: 12,
    color: '#6D6D72',
    marginTop: 6,
  },
});
