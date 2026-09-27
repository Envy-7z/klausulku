import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { SavedDocument, ChatMessage, AnalysisResult } from '../types';

const COLLECTION_NAME = 'documents';

export async function saveDocument(userId: string, analysis: AnalysisResult): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, analysis.documentId);

  // Omit rawText (large Gemini payload) — clauses hold re-analysis source.
  const { rawText, ...persistable } = analysis;
  void rawText;

  await setDoc(
    docRef,
    {
      ...persistable,
      userId,
    },
    { merge: true }
  );
}

export async function getDocumentsByUser(userId: string): Promise<SavedDocument[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('analyzedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((d) => {
    const data = d.data() as SavedDocument;
    return { ...data, chatHistory: data.chatHistory ?? [] };
  });
}

export async function getDocumentById(documentId: string): Promise<SavedDocument | null> {
  const docRef = doc(db, COLLECTION_NAME, documentId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as SavedDocument;
    return { ...data, chatHistory: data.chatHistory ?? [] };
  }
  return null;
}

export async function updateChatHistory(documentId: string, messages: ChatMessage[]): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, documentId);
  await updateDoc(docRef, {
    chatHistory: messages,
  });
}
