import type {Metadata} from 'next';
import {Open_Sans} from 'next/font/google'; // Import Open Sans
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { StoreProvider } from '@/context/store-context'; // Import StoreProvider
import { ThemeProvider } from '@/context/theme-provider'; // Import ThemeProvider

const openSans = Open_Sans({
  variable: '--font-sans', // Define CSS variable for the font
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Conceito Psi Store', // Updated title
  description: 'Explore e adquira conceitos psicológicos de forma lúdica.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR"> 
      <body className={`${openSans.variable} antialiased font-sans`}>
        <ThemeProvider storageKey="conceito-psi-theme"> {/* Added ThemeProvider */}
          <StoreProvider>
            {children}
            <Toaster />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
