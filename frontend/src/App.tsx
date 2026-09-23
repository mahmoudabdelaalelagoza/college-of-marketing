import { BrowserRouter } from "react-router-dom";
import AssistantWidget from "./components/feature/AssistantWidget";
import { AppRoutes } from "./router";

function App() {
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <AppRoutes />
      <AssistantWidget />
    </BrowserRouter>
  );
}

export default App;
