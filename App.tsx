import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getTheme, PALETTE } from './src/constants/theme';
import { Student, TabType, ToastMessage, User } from './src/models/types';
import {
  getStoredStudents,
  addStoredStudent,
  updateStoredStudent,
  deleteStoredStudent,
  resetStoredStudents,
  getStoredUser,
  saveStoredUser,
  clearStoredUser,
  getStoredThemePreference,
  saveStoredThemePreference,
} from './src/services/storage';
import { exportStudentsToPdf } from './src/services/exportPdf';

// Screens
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { StudentsScreen } from './src/screens/StudentsScreen';
import { AddStudentScreen } from './src/screens/AddStudentScreen';
import { EditStudentModal } from './src/screens/EditStudentModal';
import { ProfileScreen } from './src/screens/ProfileScreen';

// Components
import { Header } from './src/components/Header';
import { BottomNav } from './src/components/BottomNav';
import { DeleteModal } from './src/components/DeleteModal';
import { Toast } from './src/components/Toast';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Popups
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Active theme calculation with palette #89ABD2 & #E0E8F0
  const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

  const showToast = useCallback((type: 'success' | 'danger' | 'info' | 'warning', title: string, message: string) => {
    setToast({
      id: Date.now().toString(),
      type,
      title,
      message,
    });
  }, []);

  // Initialize data from AsyncStorage on application start
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [loadedTheme, loadedUser, loadedStudents] = await Promise.all([
          getStoredThemePreference(),
          getStoredUser(),
          getStoredStudents(),
        ]);

        setIsDarkMode(loadedTheme);
        setUser(loadedUser);
        setStudents(loadedStudents);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsReady(true);
      }
    }

    loadInitialData();
  }, []);

  // Toggle Dark/Light Theme with persistence
  const handleToggleTheme = async () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    await saveStoredThemePreference(nextVal);
  };

  // Auth Handlers
  const handleLoginSuccess = async (authUser: User) => {
    setUser(authUser);
    await saveStoredUser(authUser);
    setCurrentTab('dashboard');
    showToast('success', 'Login Berhasil!', `Selamat datang, ${authUser.name}`);
  };

  const handleLogout = async () => {
    await clearStoredUser();
    setUser(null);
    setCurrentTab('dashboard');
    showToast('info', 'Sampai Jumpa', 'Anda telah berhasil keluar.');
  };

  // CRUD Student Handlers
  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'createdAt'>) => {
    try {
      const created = await addStoredStudent(studentData);
      setStudents((prev) => [created, ...prev]);
      setCurrentTab('students');
      showToast('success', 'Data Tersimpan!', `Siswa ${created.nama} (NIS: ${created.nis}) berhasil ditambahkan.`);
    } catch (e: any) {
      showToast('danger', 'Gagal Menambah Siswa', e?.message || 'Terjadi kesalahan sistem.');
    }
  };

  const handleUpdateStudent = async (updated: Student) => {
    try {
      await updateStoredStudent(updated);
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setEditingStudent(null);
      showToast('success', 'Perubahan Disimpan!', `Data ${updated.nama} berhasil diperbarui.`);
    } catch (e: any) {
      showToast('danger', 'Gagal Memperbarui Siswa', e?.message || 'Terjadi kesalahan sistem.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    const name = deletingStudent.nama;
    try {
      await deleteStoredStudent(deletingStudent.id);
      setStudents((prev) => prev.filter((s) => s.id !== deletingStudent.id));
      showToast('warning', 'Data Dihapus', `Data siswa ${name} telah dihapus dari sistem.`);
    } catch (e: any) {
      showToast('danger', 'Gagal Menghapus', e?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setDeletingStudent(null);
    }
  };

  const handleResetData = async () => {
    try {
      const resetList = await resetStoredStudents();
      setStudents(resetList);
      showToast('info', 'Database Direset', 'Data siswa berhasil dikembalikan ke 10 siswa default.');
    } catch (e: any) {
      showToast('danger', 'Gagal Reset', e?.message || 'Terjadi kesalahan.');
    }
  };

  // PDF Export
  const handleExportPdf = async (filterClass?: string) => {
    showToast('info', 'Menyiapkan Dokumen', 'Sedang memproses laporan PDF...');
    const result = await exportStudentsToPdf(students, filterClass);
    if (result.success) {
      showToast('success', 'Laporan PDF Siap', result.message);
    } else {
      showToast('danger', 'Gagal Cetak PDF', result.message);
    }
  };

  if (!isReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#F4F7FB' }]}>
        <ActivityIndicator size="large" color={PALETTE.primary} />
      </View>
    );
  }

  // Not logged in -> Show Login Screen
  if (!user) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <LoginScreen
          theme={theme}
          onLoginSuccess={handleLoginSuccess}
          onToggleTheme={handleToggleTheme}
        />
        <Toast toast={toast} theme={theme} onDismiss={() => setToast(null)} />
      </SafeAreaView>
    );
  }

  // Logged in -> Render Main Application
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* App Header */}
      <Header
        theme={theme}
        user={user}
        subtitle="Selamat Datang,"
        onToggleTheme={handleToggleTheme}
        onProfilePress={() => setCurrentTab('profile')}
      />

      {/* Active Screen Tab View */}
      <View style={styles.mainContent}>
        {currentTab === 'dashboard' && (
          <DashboardScreen
            theme={theme}
            user={user}
            students={students}
            onNavigateTab={setCurrentTab}
            onEditStudent={(s) => setEditingStudent(s)}
            onDeleteStudent={(s) => setDeletingStudent(s)}
            onViewStudentDetail={(s) => setEditingStudent(s)}
            onExportPdf={() => handleExportPdf()}
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
          />
        )}

        {currentTab === 'students' && (
          <StudentsScreen
            theme={theme}
            students={students}
            onAddStudentPress={() => setCurrentTab('add')}
            onEditStudent={(s) => setEditingStudent(s)}
            onDeleteStudent={(s) => setDeletingStudent(s)}
            onExportPdf={(filterClass) => handleExportPdf(filterClass)}
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
          />
        )}

        {currentTab === 'add' && (
          <AddStudentScreen
            theme={theme}
            existingStudents={students}
            onSaveStudent={handleAddStudent}
            onCancel={() => setCurrentTab('students')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            theme={theme}
            user={user}
            totalStudents={students.length}
            onLogout={handleLogout}
            onToggleTheme={handleToggleTheme}
            onResetData={handleResetData}
            onExportPdf={() => handleExportPdf()}
          />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        theme={theme}
        studentCount={students.length}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        visible={editingStudent !== null}
        student={editingStudent}
        theme={theme}
        existingStudents={students}
        onSave={handleUpdateStudent}
        onCancel={() => setEditingStudent(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        visible={deletingStudent !== null}
        student={deletingStudent}
        theme={theme}
        onCancel={() => setDeletingStudent(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Global In-App Toast Notification */}
      <Toast toast={toast} theme={theme} onDismiss={() => setToast(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
  },
});
