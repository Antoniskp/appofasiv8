import { AuthProvider } from '@/lib/auth-context';
import TopNav from '@/components/TopNav';
import AdvertisingBox from '@/components/AdvertisingBox';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'Απόφαση',
  description: 'Η αξιόπιστη πηγή σας για τις πιο πρόσφατες ειδήσεις',
};

export default function RootLayout({ children }) {
  return (
    <html lang="el">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <TopNav />
          <main className="flex-grow">
            {children}
          </main>
          //<AdvertisingBox />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
