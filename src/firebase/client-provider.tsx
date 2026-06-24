'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [firebaseInstance, setFirebaseInstance] = useState<{
    firebaseApp: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
  } | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const instance = initializeFirebase();
    if (instance) {
      setFirebaseInstance(instance);
    } else {
      setError(true);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8 text-center">
        <div className="flex flex-col gap-4 max-w-md">
          <h1 className="text-2xl font-black text-primary uppercase tracking-tighter">System Link Failure</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The Academic OS could not establish a connection to the neural backbone. 
            Ensure your Firebase environment variables are correctly configured.
          </p>
        </div>
      </div>
    );
  }

  if (!firebaseInstance) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseInstance.firebaseApp}
      firestore={firebaseInstance.firestore}
      auth={firebaseInstance.auth}
    >
      {children}
    </FirebaseProvider>
  );
}