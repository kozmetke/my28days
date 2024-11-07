import type { Metadata } from 'next';
import AuthProvider from '@/components/providers/AuthProvider';
import ClientLayout from '@/components/layout/ClientLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'My28Days',
  description: 'A supportive community for women going through menopause',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white">
      <body className="min-h-screen">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
