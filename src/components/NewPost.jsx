import { useState, useEffect } from "react";
import { useNavigate, Navigate, useOutletContext } from "react-router-dom";
import fetchURL from "../fetchURL";
import styles from "../styles/NewPost.module.css";

const NewPost = () => {
  const {userLoggedIn} = useOutletContext();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [titleErr, setTitleErr] = useState("");
  const [content, setContent] = useState("");
  const [isCheck, setIsCheck] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTitleErr("");
    setError(null);
    const token = window.localStorage.getItem("token");

    if (title.length < 1) {
      setTitleErr("Title is required");
    } else if (!token) {
      navigate("/log-in");
      navigate(0);
    } else {
      setIsPosting(true);
      fetch(fetchURL + "/posts", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({
          title,
          content,
          published: isCheck ? true : "",
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
          else if (response.status === 401) throw new Error("Unverified");
          else throw new Error("Unable to add new post. Server Error");
        })
        .then((data) => {
          navigate("/myposts");
        })
        .catch((err) => {
          if (err.message === "Unverified") {
            navigate("/log-in");
            navigate(0);
          } else {
            setError(err.message);
            setTitle("");
            setTitleErr("");
            setContent("");
            setIsCheck(true);
          }
          setIsPosting(false);
        });
    }
  };

  const editTitle = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setTitleErr("");
  };

  const editContent = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
  };

  const toggleCheck = (e) => {
    setIsCheck(e.target.checked);
  };

  if (userLoggedIn === null) {
    return <div></div>
  }

  if (!userLoggedIn) {
    return <Navigate to="/log-in"/>
  }

  return (
    <div className={styles.base}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.titleBox}>
          <input
            type="text"
            name="title"
            placeholder="Title (required)"
            value={title}
            onChange={editTitle}
          />
          {titleErr && <p className={styles.errorMsg}>{titleErr}</p>}
        </div>
        <div className={styles.content}>
          <textarea
            name="content"
            placeholder="Body text"
            onChange={editContent}
            value={content}
          ></textarea>
        </div>
        <div className={styles.bottom}>
          <div className={styles.publishCheck}>
            <input
              type="checkbox"
              id="publish"
              name="publish"
              value="published"
              onChange={toggleCheck}
              checked={isCheck}
            />
            <label htmlFor="publish">Publish post?</label>
          </div>
          <div className={styles.submitBtn}>
            {!isPosting && <button>POST</button>}
            {isPosting && <button disabled>POSTING...</button>}
          </div>
        </div>
        {error && <p className={styles.postingError}>{error}</p>}
      </form>
    </div>
  );
};

export default NewPost;
