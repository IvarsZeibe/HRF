import styles from "../style";
import { Footer, Navbar } from "../components";
import { Outlet } from "react-router-dom";

const Layout = ({user}) => {
  return <div className="bg-primary w-full overflow-hidden min-h-screen">
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar user={user} />
      </div>
    </div>

    <div className={`bg-primary ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Outlet />
      </div>
    </div>
    
    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Footer />
      </div>
    </div>
  </div>
};

export default Layout;
