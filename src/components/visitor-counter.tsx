'use client';

import { useEffect, useState } from 'react';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function VisitorCounter() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const db = useFirestore();

  useEffect(() => {
    setMounted(true);
    const sessionId = Math.random().toString(36).substring(7);
    const sessionRef = doc(db, 'sessions', sessionId);

    // Register Session
    const sessionData = {
      id: sessionId,
      lastActive: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
    };

    setDoc(sessionRef, sessionData)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: sessionRef.path,
          operation: 'create',
          requestResourceData: sessionData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

    // Count Active Sessions
    const sessionsQuery = query(collection(db, 'sessions'));
    const unsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
      setCount(snapshot.size);
    }, async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: '/sessions',
        operation: 'list',
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });

    // Cleanup on unmount/unload
    const cleanup = () => {
      deleteDoc(sessionRef).catch(() => {});
    };

    window.addEventListener('beforeunload', cleanup);
    return () => {
      unsubscribe();
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [db]);

  if (!mounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-4 px-6 py-2 rounded-full glass border-foreground/10 shadow-lg shadow-red-500/5"
    >
      <div className="relative">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping opacity-40" />
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-[9px] font-black tracking-[0.25em] text-foreground/45 uppercase">Academic Syncs:</span>
        <AnimatePresence mode="wait">
          <motion.span 
            key={count}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[10px] font-black tracking-widest text-red-500 uppercase"
          >
            {count.toLocaleString()} ACTIVE
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
