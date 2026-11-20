import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student, User } from '../models/types';

const STORAGE_KEYS = {
  STUDENTS: '@datasiswa:students_v1',
  AUTH_USER: '@datasiswa:auth_user',
  THEME_DARK: '@datasiswa:is_dark_mode',
};

// Initial realistic seed data for SMK Plus Pelita Nusantara Bogor (XI RPL 1 & 2)
// Inspired by the exam PDF sample and real school data
export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    nis: '23241001',
    nama: 'Anderson William',
    kelas: 'XI RPL 1',
    jenisKelamin: 'Laki-laki',
    alamat: 'Jl. Raya Cikaret No. 45, Cibinong, Bogor',
    status: 'Aktif',
    telepon: '0812-3456-7890',
    avatar: '👨‍🎓',
    createdAt: '2026-07-15T08:00:00Z',
  },
  {
    id: 'std-2',
    nis: '23241002',
    nama: 'Beckett Sarah',
    kelas: 'XI RPL 1',
    jenisKelamin: 'Perempuan',
    alamat: 'Perum Cibinong City Blok B3, Bogor',
    status: 'Aktif',
    telepon: '0813-9876-5432',
    avatar: '👩‍🎓',
    createdAt: '2026-07-15T08:05:00Z',
  },
  {
    id: 'std-3',
    nis: '23241003',
    nama: 'Carter Michael',
    kelas: 'XI RPL 2',
    jenisKelamin: 'Laki-laki',
    alamat: 'Jl. Golf Ciriung No. 12, Cibinong',
    status: 'Aktif',
    telepon: '0857-1122-3344',
    avatar: '👨‍💻',
    createdAt: '2026-07-15T08:10:00Z',
  },
  {
    id: 'std-4',
    nis: '23241004',
    nama: 'Dinna Olivia',
    kelas: 'XI RPL 2',
    jenisKelamin: 'Perempuan',
    alamat: 'Jl. Mayor Oking No. 88, Citeureup, Bogor',
    status: 'Aktif',
    telepon: '0878-4455-6677',
    avatar: '👩‍💻',
    createdAt: '2026-07-15T08:15:00Z',
  },
  {
    id: 'std-5',
    nis: '23241005',
    nama: 'Farhaan Shaikh',
    kelas: 'XI RPL 1',
    jenisKelamin: 'Laki-laki',
    alamat: 'Jl. Sukaraja No. 24, Sentul, Bogor',
    status: 'Aktif',
    telepon: '0896-5544-3322',
    avatar: '🧑‍🎓',
    createdAt: '2026-07-15T08:20:00Z',
  },
  {
    id: 'std-6',
    nis: '23241006',
    nama: 'Anindya Putri Rahayu',
    kelas: 'XI RPL 1',
    jenisKelamin: 'Perempuan',
    alamat: 'Kp. Muara Beres RT 02/04, Sukaraja, Bogor',
    status: 'Aktif',
    telepon: '0812-7788-9900',
    avatar: '👩‍🔬',
    createdAt: '2026-07-15T08:25:00Z',
  },
  {
    id: 'std-7',
    nis: '23241007',
    nama: 'Bagus Pratama Putra',
    kelas: 'XI RPL 2',
    jenisKelamin: 'Laki-laki',
    alamat: 'Jl. Raya Bogor KM 43, Pabuaran, Cibinong',
    status: 'Aktif',
    telepon: '0821-3322-1100',
    avatar: '👨‍💼',
    createdAt: '2026-07-15T08:30:00Z',
  },
  {
    id: 'std-8',
    nis: '23241008',
    nama: 'Citra Dewi Anggraini',
    kelas: 'XI RPL 2',
    jenisKelamin: 'Perempuan',
    alamat: 'Puri Nirwana 1 Blok F2 No. 9, Cibinong',
    status: 'Aktif',
    telepon: '0852-6677-8899',
    avatar: '👩‍💼',
    createdAt: '2026-07-15T08:35:00Z',
  },
  {
    id: 'std-9',
    nis: '23241009',
    nama: 'Dimas Fajar Ramadhan',
    kelas: 'XI RPL 1',
    jenisKelamin: 'Laki-laki',
    alamat: 'Jl. Alternatif Sentul No. 17, Babakan Madang',
    status: 'Aktif',
    telepon: '0888-9911-2233',
    avatar: '🧑‍💼',
    createdAt: '2026-07-15T08:40:00Z',
  },
  {
    id: 'std-10',
    nis: '23241010',
    nama: 'Evelyn Nathania',
    kelas: 'XI RPL 1',
    jenisKelamin: 'Perempuan',
    alamat: 'Perum Graha Kartika Pratama Blok D4, Cibinong',
    status: 'Aktif',
    telepon: '0838-1234-5678',
    avatar: '👩‍🎨',
    createdAt: '2026-07-15T08:45:00Z',
  },
];

export const DEFAULT_USER: User = {
  username: 'admin',
  name: 'Farhaan Shaikh',
  role: 'Administrator & Petugas Data Siswa',
  school: 'SMK Plus Pelita Nusantara Bogor',
  nip: 'NIG 0180179036',
  email: 'admin.rpl@smkpluspnb.sch.id',
  avatar: '👨‍🏫',
};

// =================== Storage Helpers ===================

export async function getStoredStudents(): Promise<Student[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!json) {
      // Seed with initial students
      await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : INITIAL_STUDENTS;
  } catch (error) {
    console.error('Error reading students from AsyncStorage:', error);
    return INITIAL_STUDENTS;
  }
}

export async function saveStoredStudents(students: Student[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return true;
  } catch (error) {
    console.error('Error saving students to AsyncStorage:', error);
    return false;
  }
}

export async function addStoredStudent(studentData: Omit<Student, 'id' | 'createdAt'>): Promise<Student> {
  const current = await getStoredStudents();
  const newStudent: Student = {
    ...studentData,
    id: 'std-' + Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const updated = [newStudent, ...current];
  await saveStoredStudents(updated);
  return newStudent;
}

export async function updateStoredStudent(updatedStudent: Student): Promise<boolean> {
  const current = await getStoredStudents();
  const index = current.findIndex(s => s.id === updatedStudent.id);
  if (index === -1) return false;
  current[index] = { ...updatedStudent };
  await saveStoredStudents([...current]);
  return true;
}

export async function deleteStoredStudent(studentId: string): Promise<boolean> {
  const current = await getStoredStudents();
  const filtered = current.filter(s => s.id !== studentId);
  await saveStoredStudents(filtered);
  return true;
}

export async function resetStoredStudents(): Promise<Student[]> {
  await AsyncStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  return INITIAL_STUDENTS;
}

// User Auth Persistence
export async function getStoredUser(): Promise<User | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export async function saveStoredUser(user: User): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
}

export async function clearStoredUser(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_USER);
}

// Dark Mode Persistence
export async function getStoredThemePreference(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(STORAGE_KEYS.THEME_DARK);
    return val === 'true';
  } catch (e) {
    return false;
  }
}

export async function saveStoredThemePreference(isDark: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.THEME_DARK, isDark ? 'true' : 'false');
}
