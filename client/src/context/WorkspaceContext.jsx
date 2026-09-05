import { createContext, useContext, useState, useEffect } from 'react';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [activeDocument, setActiveDocument] = useState(() => {
    try {
      const saved = localStorage.getItem('pdfinity_active_doc') || localStorage.getItem('pdfnerd_active_doc');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [documentVersions, setDocumentVersions] = useState(() => {
    try {
      const saved = localStorage.getItem('pdfinity_doc_versions') || localStorage.getItem('pdfnerd_doc_versions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (activeDocument) {
        localStorage.setItem('pdfinity_active_doc', JSON.stringify(activeDocument));
      } else {
        localStorage.removeItem('pdfinity_active_doc');
        localStorage.removeItem('pdfnerd_active_doc');
      }
    } catch {}
  }, [activeDocument]);

  useEffect(() => {
    try {
      localStorage.setItem('pdfinity_doc_versions', JSON.stringify(documentVersions));
    } catch {}
  }, [documentVersions]);

  const setWorkingDocument = (docData) => {
    const newDoc = {
      id: docData.id || `doc_${Date.now()}`,
      name: docData.name || 'Untitled_Document.pdf',
      sizeBytes: docData.sizeBytes || docData.size || 0,
      pageCount: docData.pageCount || 1,
      downloadUrl: docData.downloadUrl || null,
      file: docData.file || null,
      lastOperation: docData.lastOperation || 'Imported',
      updatedAt: new Date().toISOString(),
      healthScore: docData.healthScore || null,
      privacyRisk: docData.privacyRisk || null,
    };
    setActiveDocument(newDoc);

    // Record initial or updated version
    setDocumentVersions((prev) => [
      {
        id: `ver_${Date.now()}`,
        name: newDoc.name,
        operation: newDoc.lastOperation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        downloadUrl: newDoc.downloadUrl,
      },
      ...prev.slice(0, 9),
    ]);
  };

  const clearWorkingDocument = () => {
    setActiveDocument(null);
    setDocumentVersions([]);
    localStorage.removeItem('pdfinity_active_doc');
    localStorage.removeItem('pdfinity_doc_versions');
    localStorage.removeItem('pdfnerd_active_doc');
    localStorage.removeItem('pdfnerd_doc_versions');
  };

  return (
    <WorkspaceContext.Provider
      value={{
        activeDocument,
        documentVersions,
        setWorkingDocument,
        clearWorkingDocument,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
