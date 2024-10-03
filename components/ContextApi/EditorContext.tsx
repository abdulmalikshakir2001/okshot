// EditorContext.tsx
import { createContext, useContext, ReactNode, useState } from "react";
import { useTranslation } from 'next-i18next';


// Define the context type
interface EditorContextType {
  values: any;
  setValues: (newValues: any) => void;
}

// Create the context with a default value
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Create a provider component
export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation('common');

  
  const [values, setValues] = useState<any>({
    malik: "malik",
    abdul: "abdul",
    text:t("text")
  });

  return (
    <EditorContext.Provider value={{ values, setValues }}>
      {children}
    </EditorContext.Provider>
  );
};

// Create a custom hook to use the EditorContext
export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};
