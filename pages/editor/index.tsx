// In your main component file, e.g., App.tsx or the page file where Editor is used
import { EditorProvider } from "@/components/ContextApi/EditorContext";
import Editor from "./Editor";
const Home = () => {
  return (
    <EditorProvider>
      <Editor />
    </EditorProvider>
  );
};

export default Home;
