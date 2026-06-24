
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { BackgroundStars } from "@/components/background-stars"
import { CustomCursor } from "@/components/landing/custom-cursor"
import { FirebaseClientProvider } from "@/firebase";
import { SessionTracker } from "@/components/session-tracker";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { SoundController } from "@/components/landing/sound-controller";

export const metadata: Metadata = {
  title: 'NEXORA | The Student Operating System',
  description: 'Everything you need to succeed at IIT. Resource management, mock exams, AI assistant and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&family=Barlow+Condensed:wght@600;700;800;900&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            try {
              var savedTheme = localStorage.getItem('theme') || 'dark';
              if (savedTheme === 'light') {
                document.documentElement.classList.add('light');
                document.documentElement.classList.remove('dark');
              } else {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
              }
            } catch (e) {}
          })();
        `}} />
      </head>
      <body className="font-sans antialiased bg-background text-foreground relative min-h-screen" suppressHydrationWarning>
        <FirebaseClientProvider>
          <SessionTracker />
          <BackgroundStars />
          <CustomCursor />
          <SmoothScrollProvider>
            <div className="relative z-10">
              {children}
            </div>
            <SoundController />
          </SmoothScrollProvider>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
