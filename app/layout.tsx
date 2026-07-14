import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ikhtiar Ramadhan 1447H | SatuWakaf',
  description: 'Kumpulan program wakaf pilihan dalam Ikhtiar Ramadhan 1447H.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
