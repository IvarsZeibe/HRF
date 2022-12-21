import { Testing, Hero, Layout, ReactionTest, AimTest, NumberMemoryTest, WritingTest, SignIn, ControlPanel, Profile } from "./components";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AuthenticationService from "./services/AuthenticationService";
import { useState, useEffect } from "react";

const App = () => {
  const [user, setUser] = useState();
  const location = useLocation();
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (user && !AuthenticationService.isSignedIn()) {
      setUser(null);
    } else {
      AuthenticationService.getUser()
      .then(u => {
        setUser(u);
      })
      .catch(error => AuthenticationService.signOut());
    }
  }, [location]);

  // https://stackoverflow.com/questions/40280369/use-anchors-with-react-router
  useEffect(() => {
    // if not a hash link, scroll to top
    if (hash === '') {
      window.scrollTo(0, 0);
    }
    // else scroll to id
    else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [pathname, hash, key]); // do this on route change

  return <Routes>
    <Route path="/" element={<Layout user={user} />}>
      <Route index element={<><Hero /><Testing /></>} />
      <Route path="/ReactionTest" element={<ReactionTest />} />
      <Route path="/AimTest" element={<AimTest />} />
      <Route path="/NumberMemoryTest" element={<NumberMemoryTest />} />
      <Route path="/WritingTest" element={<WritingTest />} />
      <Route path="/SignIn" element={<SignIn user={user} setUser={setUser} />} />
      <Route path="/controlpanel" element={<ControlPanel user={user} />} />
      <Route path="/profile" element={<Profile user={user} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
};

export default App;
