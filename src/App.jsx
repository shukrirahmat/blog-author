import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import fetchURL from "./fetchURL.jsx";
import styles from "./App.module.css";

function App() {
  const navigate = useNavigate();

  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState(null);

  const toggleLogIn = (state) => {
    setUserLoggedIn(state);
  };

  const handleLogOut = () => {
    window.localStorage.removeItem("token");
    navigate("/");
    navigate(0);
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setIsLoading(true);

    if (!token) {
      toggleLogIn(false);
      setIsLoading(false);
    } else {
      fetch(fetchURL + "/user", {
        mode: "cors",
        method: "get",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response.ok) return response.json();
          else throw new Error("Server error");
        })
        .then((data) => {
          setUserName(data.username);
          toggleLogIn(true);
          setIsLoading(false);
        })
        .catch((err) => {
          window.localStorage.removeItem("token");
          toggleLogIn(false);
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <div className={styles.app}>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          <h1>THE BLOG <span>(Author lounge)</span></h1>
        </Link>
        <div className={styles.navbtnContainer}>
          {userLoggedIn && !isLoading && <p>Hello, {userName}</p>}
          {!userLoggedIn && !isLoading && <Link to="/log-in">LOG IN</Link>}
          {!userLoggedIn && !isLoading && <Link to="/sign-up">SIGN UP</Link>}
          {userLoggedIn && !isLoading && <Link to="/myposts">MY POSTS</Link>}
          {userLoggedIn && !isLoading && (
            <button onClick={handleLogOut}>LOG OUT</button>
          )}
        </div>
      </nav>
      <Outlet context={userLoggedIn} />
      <div className={styles.footer}>
        <p>© shkrrhmt 2025</p>
      </div>
    </div>
  );
}

export default App;
