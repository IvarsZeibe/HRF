import { Testing, Hero, Layout, ReactionTest, AimTest, NumberMemoryTest, WritingTest, SignIn } from "./components";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<><Hero /><Testing /></>} />
        <Route path="/ReactionTest" element={<ReactionTest />} />
        <Route path="/AimTest" element={<AimTest />} />
        <Route path="/NumberMemoryTest" element={<NumberMemoryTest />} />
        <Route path="/WritingTest" element={<WritingTest />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
