import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../constants/theme';
import { User } from '../models/types';

interface HeaderProps {
  theme: AppTheme;
  user: User | null;
  title?: string;
  subtitle?: string;
  onToggleTheme: () => void;
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  user,
  title,
  subtitle,
  onToggleTheme,
  onProfilePress,
}) => {
  const { colors, spacing, radii } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.leftCol}>
        <Text style={[styles.greetingLabel, { color: colors.textSecondary }]}>
          {subtitle || 'Halo,'}
        </Text>
        <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
          {title || user?.name || 'Administrator'}
        </Text>
        <View style={styles.schoolBadgeRow}>
          <View style={[styles.schoolBadge, { backgroundColor: colors.badgeBg }]}>
            <Text style={[styles.schoolBadgeText, { color: colors.badgeText }]}>
              SMK Plus Pelita Nusantara
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
          onPress={onToggleTheme}
          accessibilityLabel="Toggle Dark/Light Mode"
          activeOpacity={0.7}
        >
          <Ionicons
            name={theme.isDark ? 'sunny' : 'moon'}
            size={20}
            color={theme.isDark ? '#F59E0B' : colors.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.avatarButton, { borderColor: colors.primary, backgroundColor: colors.secondary }]}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <Text style={styles.avatarEmoji}>{user?.avatar || '👨‍🏫'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  leftCol: {
    flex: 1,
    marginRight: 12,
  },
  greetingLabel: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 1,
  },
  schoolBadgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  schoolBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  schoolBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
});
