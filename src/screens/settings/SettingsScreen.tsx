import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useState } from 'react';

type SettingsItemProps = {
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
};

function SettingsItem({
  label,
  value,
  onPress,
  showArrow = true,
  toggle,
  toggleValue,
  onToggle,
}: SettingsItemProps) {
  return (
    <Pressable
      style={styles.item}
      onPress={onPress}
      disabled={toggle}>
      <Text style={styles.itemLabel}>{label}</Text>
      <View style={styles.itemRight}>
        {value && <Text style={styles.itemValue}>{value}</Text>}
        {toggle && (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: '#E0E0E0', true: '#34C759' }}
            thumbColor="#FFFFFF"
          />
        )}
        {showArrow && !toggle && <Text style={styles.arrow}>›</Text>}
      </View>
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [vibration, setVibration] = useState(true);
  const [sound, setSound] = useState(true);
  const [notifications, setNotifications] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ 뒤로</Text>
        </Pressable>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 화면 */}
        <SectionHeader title="화면" />
        <View style={styles.section}>
          <SettingsItem label="배경 설정" onPress={() => navigation.navigate('BackgroundSetting')} />
        </View>

        {/* 일반 */}
        <SectionHeader title="일반" />
        <View style={styles.section}>
          <SettingsItem
            label="진동"
            toggle
            toggleValue={vibration}
            onToggle={setVibration}
          />
          <View style={styles.separator} />
          <SettingsItem
            label="소리"
            toggle
            toggleValue={sound}
            onToggle={setSound}
          />
          <View style={styles.separator} />
          <SettingsItem
            label="알림"
            toggle
            toggleValue={notifications}
            onToggle={setNotifications}
          />
        </View>

        {/* 정보 */}
        <SectionHeader title="정보" />
        <View style={styles.section}>
          <SettingsItem label="버전" value="0.0.1" showArrow={false} />
          <View style={styles.separator} />
          <SettingsItem label="개인정보 처리방침" />
          <View style={styles.separator} />
          <SettingsItem label="오픈소스 라이선스" />
        </View>

        {/* 위험 구역 */}
        <SectionHeader title="" />
        <View style={styles.section}>
          <Pressable style={styles.item}>
            <Text style={styles.destructiveText}>데이터 초기화</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    backgroundColor: '#F2F2F7',
  },
  backButton: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6D6D72',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  itemLabel: {
    fontSize: 17,
    color: '#000',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemValue: {
    fontSize: 17,
    color: '#8E8E93',
  },
  arrow: {
    fontSize: 22,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    marginLeft: 16,
  },
  destructiveText: {
    fontSize: 17,
    color: '#FF3B30',
    textAlign: 'center',
    flex: 1,
  },
});
