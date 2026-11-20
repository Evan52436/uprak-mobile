import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../constants/theme';

interface StatSummaryProps {
  theme: AppTheme;
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
  class1Count: number;
  class2Count: number;
}

export const StatSummary: React.FC<StatSummaryProps> = ({
  theme,
  totalStudents,
  maleCount,
  femaleCount,
  class1Count,
  class2Count,
}) => {
  const { colors, radii, shadows } = theme;

  const malePercent = totalStudents > 0 ? Math.round((maleCount / totalStudents) * 100) : 50;
  const femalePercent = 100 - malePercent;

  return (
    <View style={styles.container}>
      {/* Primary Highlight Card: Total Students & Ratio (Like in PDF Mockup) */}
      <View
        style={[
          styles.mainCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.lg,
          },
          shadows.card,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <View style={[styles.iconCircle, { backgroundColor: colors.secondary }]}>
              <Ionicons name="school" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Data Siswa Terdaftar</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Jurusan Rekayasa Perangkat Lunak (RPL)
              </Text>
            </View>
          </View>
          <View style={[styles.totalPill, { backgroundColor: colors.primary }]}>
            <Text style={styles.totalPillText}>{totalStudents} Siswa</Text>
          </View>
        </View>

        {/* Gender Breakdown Row (Inspired by page 1 PDF) */}
        <View style={[styles.breakdownBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <View style={styles.statMetricItem}>
            <View style={styles.metricLabelRow}>
              <View style={[styles.dot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Laki-laki</Text>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {maleCount} <Text style={[styles.metricPercent, { color: colors.textMuted }]}>({malePercent}%)</Text>
            </Text>
          </View>

          <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />

          <View style={styles.statMetricItem}>
            <View style={styles.metricLabelRow}>
              <View style={[styles.dot, { backgroundColor: '#EC4899' }]} />
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Perempuan</Text>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {femaleCount} <Text style={[styles.metricPercent, { color: colors.textMuted }]}>({femalePercent}%)</Text>
            </Text>
          </View>
        </View>

        {/* Visual Progress Ratio Bar */}
        <View style={styles.progressBarWrapper}>
          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${malePercent}%`, backgroundColor: colors.primary },
              ]}
            />
            <View
              style={[
                styles.progressBarFill,
                { width: `${femalePercent}%`, backgroundColor: '#EC4899' },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Class distribution cards row */}
      <View style={styles.gridRow}>
        <View
          style={[
            styles.subCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.md,
            },
            shadows.card,
          ]}
        >
          <View style={styles.subCardHeader}>
            <Ionicons name="code-slash" size={18} color={colors.primary} />
            <Text style={[styles.subCardBadge, { backgroundColor: colors.secondary, color: colors.primaryDark }]}>
              RPL 1
            </Text>
          </View>
          <Text style={[styles.subCardNumber, { color: colors.text }]}>{class1Count}</Text>
          <Text style={[styles.subCardLabel, { color: colors.textSecondary }]}>Siswa di XI RPL 1</Text>
        </View>

        <View
          style={[
            styles.subCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.md,
            },
            shadows.card,
          ]}
        >
          <View style={styles.subCardHeader}>
            <Ionicons name="phone-portrait-outline" size={18} color={colors.primary} />
            <Text style={[styles.subCardBadge, { backgroundColor: colors.secondary, color: colors.primaryDark }]}>
              RPL 2
            </Text>
          </View>
          <Text style={[styles.subCardNumber, { color: colors.text }]}>{class2Count}</Text>
          <Text style={[styles.subCardLabel, { color: colors.textSecondary }]}>Siswa di XI RPL 2</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  mainCard: {
    padding: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  totalPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  totalPillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  breakdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  metricPercent: {
    fontSize: 12,
    fontWeight: '500',
  },
  verticalDivider: {
    width: 1,
    height: 32,
  },
  progressBarWrapper: {
    marginTop: 14,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  subCard: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
  },
  subCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subCardBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subCardNumber: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },
  subCardLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
