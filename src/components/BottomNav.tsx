import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../constants/theme';
import { TabType } from '../models/types';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  theme: AppTheme;
  studentCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  theme,
  studentCount,
}) => {
  const { colors } = theme;

  const tabs: { key: TabType; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap; badge?: number }[] = [
    { key: 'dashboard', label: 'Beranda', icon: 'grid-outline', activeIcon: 'grid' },
    { key: 'students', label: 'Siswa', icon: 'people-outline', activeIcon: 'people', badge: studentCount },
    { key: 'add', label: 'Tambah', icon: 'add-circle-outline', activeIcon: 'add-circle' },
    { key: 'profile', label: 'Profil', icon: 'person-outline', activeIcon: 'person' },
  ];

  return (
    <View style={[styles.navWrapper, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <View style={styles.navContainer}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                isActive && [styles.activeTabItem, { backgroundColor: colors.secondaryLight }],
              ]}
              onPress={() => onChangeTab(tab.key)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={24}
                  color={isActive ? colors.primary : colors.textMuted}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? colors.primaryDark : colors.textMuted,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
              {isActive && (
                <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navWrapper: {
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 70,
    position: 'relative',
  },
  activeTabItem: {
    transform: [{ scale: 1.02 }],
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
  },
  activeIndicator: {
    width: 14,
    height: 3,
    borderRadius: 2,
    marginTop: 3,
  },
});
