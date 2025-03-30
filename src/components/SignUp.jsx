import { useState } from "react";
import { useNavigate, Navigate, useOutletContext } from "react-router-dom";
import fetchURL from "../fetchURL";
import styles from "../styles/SignUp.module.css";

const SignUp = () => {
  const userLoggedIn = useOutletContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [otherErr, setOtherErr] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const isFirstCharALetter = (string) => {
    return isNaN(string.charAt(0)) && string.charAt(0) !== "_";
  };

  const editUsername = (e) => {
    const newname = e.target.value;
    setUsername(newname);
    if (newname.length > 0 && !newname.match("^[a-zA-Z0-9_]+$")) {
      setUsernameErr("Only letters, numbers and underscores are allowed");
    } else if (newname.length > 0 && !isFirstCharALetter(newname)) {
      setUsernameErr("First character should be a letter");
    } else {
      setUsernameErr("");
    }
  };

  const editPassword = (e) => {
    const newpassword = e.target.value;
    setPassword(newpassword);
    if (newpassword !== password2) {
      setPasswordErr("Password did not match");
    } else if (newpassword.length > 0 && newpassword.length < 6) {
      setPasswordErr("Password should have 6 characters minimum");
    } else {
      setPasswordErr("");
    }
  };

  const confirmPassword = (e) => {
    const newpassword = e.target.value;
    setPassword2(newpassword);
    if (newpassword !== password) {
      setPasswordErr("Password did not match");
    } else if (newpassword.length > 0 && newpassword.length < 6) {
      setPasswordErr("Password should have 6 characters minimum");
    } else {
      setPasswordErr("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOtherErr("");

    if (username.length < 1 || (password.length < 1 && password2.length < 1)) {
      if (username.length < 1) {
        setUsernameErr("Username is required");
      }
      if (password.length < 1 && password2.length < 1) {
        setPasswordErr("Password is required");
      }
    } else if (
      !username.match("^[a-zA-Z0-9_]+$") ||
      !isFirstCharALetter(username) ||
      password !== password2 ||
      password.length < 6
    ) {
      // Do nothing, sign in failed
    } else {
      setIsSigning(true);

      fetch(fetchURL + "/user/sign-up", {
        mode: "cors",
        method: "POST",
        headers: { "Content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username,
          password,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to sign up. server error");
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            setIsSigning(false);
            setUsernameErr(data.error);
          } else {
            setIsSigning(false);
            setIsFinished(true);
          }
        })
        .catch((err) => {
          setIsSigning(false);
          setOtherErr(err.message);
        });
    }
  };

  if (userLoggedIn) {
    return <Navigate to="/" />;
  }

  if (isFinished) {
    return (<div className={styles.base}>
      <p className={styles.successMsg}>Sign up successful. You can now log in with username "{username}"</p>
    </div>)
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
        <div className={styles.pw1}>
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
        <div className={styles.pw2}>
        <label htmlFor="password2">CONFIRM PASSWORD</label>
        <input
          type="password"
          name="password2"
          id="password2"
          value={password2}
          onChange={confirmPassword}
        />
        {passwordErr && <p className={styles.errorMsg}>{passwordErr}</p>}
        </div>       
        <div className={styles.submitBtn}>
        {!isSigning && <button className={styles.activeBtn}>SIGN UP</button>}
        {isSigning && <button disabled>SIGNING UP...</button>}
        {otherErr && <p className={styles.errorMsg}>{otherErr}</p>}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
