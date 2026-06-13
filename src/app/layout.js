import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppStateProvider } from '@/context/AppStateContext';

export const metadata = {
  title: 'UniOS — Talent Alignment Ecosystem',
  description: 'UniOS — The Data-Driven Talent Alignment Ecosystem. Real-time skill verification, cohort analytics, and AI-enabled candidate mapping.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppStateProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
