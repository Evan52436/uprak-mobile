import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../constants/theme';
import { Student, TabType, User } from '../models/types';
import { StatSummary } from '../components/StatCard';
import { StudentCard } from '../components/StudentCard';

interface DashboardScreenProps {
  theme: AppTheme;
  user: User | null;
  students: Student[];
  onNavigateTab: (tab: TabType) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onViewStudentDetail: (student: Student) => void;
  onExportPdf: () => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  theme,
  user,
  students,
  onNavigateTab,
  onEditStudent,
  onDeleteStudent,
  onViewStudentDetail,
  onExportPdf,
  searchQuery,
  onChangeSearchQuery,
}) => {
  const { colors, radii, shadows } = theme;

  // Compute statistics
  const totalStudents = students.length;
  const maleCount = students.filter((s) => s.jenisKelamin === 'Laki-laki').length;
  const femaleCount = students.filter((s) => s.jenisKelamin === 'Perempuan').length;
  const class1Count = students.filter((s) => s.kelas.includes('1')).length;
  const class2Count = students.filter((s) => s.kelas.includes('2')).length;

  // 4 most recent students
  const recentStudents = students.slice(0, 4);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Search Input Bar (Matching Page 1 PDF Mockup) */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.lg,
          },
          shadows.card,
        ]}
      >
        <Ionicons name="search-outline" size={20} color={colors.primary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Cari siswa berdasarkan nama / NIS..."
          placeholderTextColor={colors.inputPlaceholder}
          value={searchQuery}
          onChangeText={(q) => {
            onChangeSearchQuery(q);
            if (q.length > 0) {
              onNavigateTab('students');
            }
          }}
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => onChangeSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => onNavigateTab('students')}>
            <Ionicons name="filter-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Category Icons Row (From Page 1 PDF Mockup: Dashboard, Students, Notices, Add) */}
      <View style={styles.categoryRow}>
        <TouchableOpacity
          style={[styles.categoryItem, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md }, shadows.card]}
          onPress={() => onNavigateTab('dashboard')}
          activeOpacity={0.7}
        >
          <View style={[styles.categoryIconCircle, { backgroundColor: colors.secondary }]}>
            <Ionicons name="grid" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.categoryLabel, { color: colors.text }]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryItem, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md }, shadows.card]}
          onPress={() => onNavigateTab('students')}
          activeOpacity={0.7}
        >
          <View style={[styles.categoryIconCircle, { backgroundColor: colors.secondary }]}>
            <Ionicons name="people" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.categoryLabel, { color: colors.text }]}>Data Siswa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryItem, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md }, shadows.card]}
          onPress={() => onNavigateTab('add')}
          activeOpacity={0.7}
        >
          <View style={[styles.categoryIconCircle, { backgroundColor: colors.secondary }]}>
            <Ionicons name="person-add" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.categoryLabel, { color: colors.text }]}>+ Siswa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryItem, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md }, shadows.card]}
          onPress={onExportPdf}
          activeOpacity={0.7}
        >
          <View style={[styles.categoryIconCircle, { backgroundColor: colors.secondary }]}>
            <Ionicons name="document-text" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.categoryLabel, { color: colors.text }]}>Cetak PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Important Announcement Notice Banner (Inspired by Page 1 PDF Mockup "Due fees / Notice") */}
      <View
        style={[
          styles.noticeBanner,
          {
            backgroundColor: colors.surface,
            borderColor: colors.primaryLight,
            borderLeftColor: colors.primary,
            borderRadius: radii.md,
          },
          shadows.card,
        ]}
      >
        <View style={styles.noticeIconCircle}>
          <Ionicons name="megaphone" size={20} color={colors.primary} />
        </View>
        <View style={styles.noticeTextCol}>
          <Text style={[styles.noticeTitle, { color: colors.text }]}>
            Asesmen Sumatif Akhir Semester
          </Text>
          <Text style={[styles.noticeDesc, { color: colors.textSecondary }]}>
            Pengujian CRUD Pemrograman Perangkat Bergerak TA 2026-2027 terlaksana aktif.
          </Text>
        </View>
      </View>

      {/* Main Statistics Summary Component */}
      <StatSummary
        theme={theme}
        totalStudents={totalStudents}
        maleCount={maleCount}
        femaleCount={femaleCount}
        class1Count={class1Count}
        class2Count={class2Count}
      />

      {/* Recent Students Section */}
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Siswa Terbaru</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Menampilkan {recentStudents.length} dari {totalStudents} siswa terdaftar
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.viewAllBtn, { backgroundColor: colors.secondary, borderColor: colors.primaryLight }]}
          onPress={() => onNavigateTab('students')}
          activeOpacity={0.7}
        >
          <Text style={[styles.viewAllBtnText, { color: colors.primaryDark }]}>Lihat Semua</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primaryDark} />
        </TouchableOpacity>
      </View>

      {/* List of Recent Students */}
      {recentStudents.map((item) => (
        <StudentCard
          key={item.id}
          student={item}
          theme={theme}
          onEdit={onEditStudent}
          onDelete={onDeleteStudent}
          onPress={onViewStudentDetail}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 18,
    paddingBottom: 28,
    gap: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderWidth: 1,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderLeftWidth: 5,
    gap: 12,
  },
  noticeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTextCol: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  noticeDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  viewAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
