import { useState } from "react";
import { useNavigate, Navigate, useOutletContext} from "react-router-dom";
import fetchURL from "../fetchURL";
import styles from "../styles/LogIn.module.css";

const LogIn = () => {
  const userLoggedIn = useOutletContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [otherErr, setOtherErr] = useState("");

  const editUsername = (e) => {
    const newname = e.target.value;
    setUsername(newname);
    setUsernameErr("");
  };

  const editPassword = (e) => {
    const newpassword = e.target.value;
    setPassword(newpassword);
    setPasswordErr("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsernameErr("");
    setPasswordErr("");

    if (username.length < 1 || password.length < 1) {
      if (username.length < 1) {
        setUsernameErr("Username is required");
      }
      if (password.length < 1) {
        setPasswordErr("Password is required");
      }
    } else {
      setIsLogging(true);

      fetch(fetchURL + "/user/log-in", {
        mode: "cors",
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username,
          password,
          authorCheck: true
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to log in. server error");
          }
          return res.json();
        })
        .then((data) => {
          if (data.usernameErr) {
            setIsLogging(false);
            setUsernameErr(data.usernameErr);
          } else if (data.passwordErr) {
            setIsLogging(false);
            setPasswordErr(data.passwordErr);
          } else {
            setIsLogging(false);
            window.localStorage.setItem("token", data.token);
            navigate("/");
            navigate(0);
          }
        })
        .catch((err) => {
          setIsLogging(false);
          setOtherErr(err.message);
        });
    }
  };

  if (userLoggedIn) {
    return <Navigate to="/"/>
  }

  return (
    <div className={styles.base}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.username}>
        <label htmlFor="username">USERNAME</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={editUsername}
        />
        {usernameErr && <p className={styles.errorMsg}>{usernameErr}</p>}
        </div>
        <div className={styles.password}>
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={editPassword}
        />
        {passwordErr && <p className={styles.errorMsg}>{passwordErr}</p>}
        </div>
        <div className={styles.submitBtn}>
        {otherErr && <p className={styles.errorMsg}>{otherErr}</p>}
        {!isLogging && <button>LOG IN</button>}
        {isLogging && <button disabled>LOGGING IN...</button>}
        </div>
      </form>
    </div>
  );
};

export default LogIn;
