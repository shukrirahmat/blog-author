import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import fetchURL from "../fetchURL";
import styles from "../styles/NewPost.module.css";

const NewPost = () => {
  const userLoggedIn = useOutletContext();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [titleErr, setTitleErr] = useState("");
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = () => {};
  const editTitle = () => {};
  const editContent = () => {};

  if (!userLoggedIn) {
    navigate("/log-in");
    navigate(0);
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
        <div className={styles.submitBtn}>
          {!isPosting && <button>POST</button>}
          {isPosting && <button disabled>POSTING...</button>}
        </div>
      </form>
    </div>
  );
};

export default NewPost;
