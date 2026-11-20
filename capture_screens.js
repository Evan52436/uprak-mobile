const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 }, // Pixel 7 viewport
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 1. Screenshot Login Screen
  console.log('Capturing 01_halaman_login.png...');
  await page.screenshot({ path: path.join(screenshotDir, '01_halaman_login.png'), fullPage: false });

  // Click on "Admin (admin / admin123)" quick credential chip
  console.log('Filling admin credentials...');
  const adminChip = await page.getByText('Admin (admin / admin123)');
  if (await adminChip.isVisible()) {
    await adminChip.click();
  } else {
    await page.getByPlaceholder('Masukkan username').fill('admin');
    await page.getByPlaceholder('Masukkan password').fill('admin123');
  }
  await page.waitForTimeout(500);

  // Click "Masuk ke Aplikasi"
  await page.getByText('Masuk ke Aplikasi').click();
  await page.waitForTimeout(2000);

  // 2. Screenshot Dashboard Screen
  console.log('Capturing 02_halaman_dashboard.png...');
  await page.screenshot({ path: path.join(screenshotDir, '02_halaman_dashboard.png'), fullPage: false });

  // 3. Navigate to Students Tab
  console.log('Navigating to Students tab...');
  await page.getByText('Siswa', { exact: true }).click();
  await page.waitForTimeout(1500);
  console.log('Capturing 03_halaman_data_siswa.png...');
  await page.screenshot({ path: path.join(screenshotDir, '03_halaman_data_siswa.png'), fullPage: false });

  // 4. Navigate to Add Student Tab
  console.log('Navigating to Add Student tab...');
  await page.getByText('Tambah', { exact: true }).click();
  await page.waitForTimeout(1500);
  console.log('Capturing 04_halaman_tambah_siswa.png...');
  await page.screenshot({ path: path.join(screenshotDir, '04_halaman_tambah_siswa.png'), fullPage: false });

  // 5. Open Edit Modal (navigate back to students and click Edit on first student)
  console.log('Opening Edit modal...');
  await page.getByText('Siswa', { exact: true }).click();
  await page.waitForTimeout(1000);
  const editButtons = await page.getByText('Edit').all();
  if (editButtons.length > 0) {
    await editButtons[0].click();
    await page.waitForTimeout(1000);
    console.log('Capturing 05_halaman_edit_siswa.png...');
    await page.screenshot({ path: path.join(screenshotDir, '05_halaman_edit_siswa.png'), fullPage: false });
    // Close modal
    await page.getByText('Batal').last().click();
    await page.waitForTimeout(600);
  }

  // 6. Navigate to Profile Screen
  console.log('Navigating to Profile tab...');
  await page.getByText('Profil', { exact: true }).click();
  await page.waitForTimeout(1500);
  console.log('Capturing 06_halaman_profil.png...');
  await page.screenshot({ path: path.join(screenshotDir, '06_halaman_profil.png'), fullPage: false });

  // 7. Toggle Dark Mode
  console.log('Toggling Dark Mode...');
  const darkModeToggle = await page.getByText(/Mode Tampilan:/);
  if (await darkModeToggle.isVisible()) {
    await darkModeToggle.click();
    await page.waitForTimeout(1000);
    console.log('Capturing 07_dark_mode_profil.png...');
    await page.screenshot({ path: path.join(screenshotDir, '07_dark_mode_profil.png'), fullPage: false });

    // Go to dashboard in dark mode
    await page.getByText('Beranda', { exact: true }).click();
    await page.waitForTimeout(1000);
    console.log('Capturing 08_dark_mode_dashboard.png...');
    await page.screenshot({ path: path.join(screenshotDir, '08_dark_mode_dashboard.png'), fullPage: false });
  }

  // 8. Capture Delete Confirmation Modal
  console.log('Capturing Delete Confirmation Modal...');
  await page.getByText('Beranda', { exact: true }).click();
  await page.waitForTimeout(600);
  // Switch back to light mode for standard presentation
  const sunBtn = await page.getByLabel('Toggle Dark/Light Mode');
  if (await sunBtn.isVisible()) {
    await sunBtn.click();
    await page.waitForTimeout(600);
  }
  await page.getByText('Siswa', { exact: true }).click();
  await page.waitForTimeout(1000);
  const deleteButtons = await page.getByText('Hapus').all();
  if (deleteButtons.length > 0) {
    await deleteButtons[0].click();
    await page.waitForTimeout(800);
    console.log('Capturing 09_konfirmasi_hapus_siswa.png...');
    await page.screenshot({ path: path.join(screenshotDir, '09_konfirmasi_hapus_siswa.png'), fullPage: false });
    await page.getByText('Batal').last().click();
    await page.waitForTimeout(600);
  }

  // 9. Capture Student Detail Modal
  console.log('Capturing Student Detail Modal...');
  const firstStudent = await page.getByText('Anderson William');
  if (await firstStudent.isVisible()) {
    await firstStudent.click();
    await page.waitForTimeout(800);
    console.log('Capturing 10_detail_siswa_modal.png...');
    await page.screenshot({ path: path.join(screenshotDir, '10_detail_siswa_modal.png'), fullPage: false });
    await page.getByText('Tutup').click();
    await page.waitForTimeout(600);
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
