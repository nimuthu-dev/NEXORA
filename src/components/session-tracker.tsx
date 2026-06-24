
'use client';

import { useEffect } from 'react';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useAuth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function SessionTracker() {
  const db = useFirestore();
  const auth = useAuth();

  useEffect(() => {
    const sessionId = Math.random().toString(36).substring(7);
    const sessionRef = doc(db, 'sessions', sessionId);

    const registerSession = async (uid?: string) => {
      const sessionData = {
        id: sessionId,
        uid: uid || null,
        lastActive: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        timestamp: serverTimestamp()
      };

      setDoc(sessionRef, sessionData, { merge: true })
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: sessionRef.path,
            operation: 'write',
            requestResourceData: sessionData,
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        });
    };

    // Register initial session
    registerSession();

    // Update session when auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      registerSession(user?.uid);
    });

    const cleanup = () => {
      deleteDoc(sessionRef).catch(() => {});
    };

    window.addEventListener('beforeunload', cleanup);
    
    return () => {
      unsubscribeAuth();
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [db, auth]);

  return null;
}
