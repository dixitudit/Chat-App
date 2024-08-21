import { Route, Routes } from "react-router-dom";
import "./App.css";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home/Home";
import Signin from "./pages/Signin/Signin";
import IsCookiePresent from "./components/IsCookiePresent";
import Signup from "./pages/Signup/Signup";
import Chat from "./pages/Chat/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <ScrollToTop />
      <IsCookiePresent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/chats" element={<Chat />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
