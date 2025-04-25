import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
import fetchURL from "../fetchURL";
import { format } from "date-fns";
import styles from "../styles/Post.module.css";

const Post = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isAddingComment, setIsAddingComment] = useState(false);

  const { postId } = useParams();
  const userLoggedIn = useOutletContext();
  const navigate = useNavigate();

  const handleComment = (e) => {
    setCommentText(e.target.value);
  };

  const submitComment = (e) => {
    e.preventDefault();
    setError(null);
    if (commentText.length > 0) {
      const token = window.localStorage.getItem("token");

      if (!token) {        
        navigate("/log-in");
        navigate(0);
        
      } else {
        setIsAddingComment(true);
        fetch(fetchURL + "/posts/" + postId + "/comments", {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: new URLSearchParams({
            content: commentText,
          }),
        })
          .then((response) => {
            if (response.ok) return response.json();
            else if (response.status === 401) throw new Error("Unverified");
            else throw new Error("Unable to add comment. Server Error");
          })
          .then((data) => {
            let newComments = comments.slice();
            newComments.push(data);
            setComments(newComments);
            setIsAddingComment(false);
            setCommentText("");
          })
          .catch((err) => {
            if (err.message === "Unverified") {             
              navigate("/log-in");
              navigate(0);
              
            } else {
              setCommentError(err.message);
              setCommentText("");
            }
            setIsAddingComment(false);
          });
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch(fetchURL + "/posts/" + postId, {
      mode: "cors",
      method: "get",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Server Error");
        }
        return response.json();
      })
      .then((data) => {
        setPost(data);
        setComments(data.comments);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p className={styles.message}>Loading Posts...</p>;
  } else if (error) {
    return <p className={styles.message}>{error}</p>;
  } else {
    return (
      <div className={styles.base}>
        <div className={styles.post}>
          <div className={styles.postTitle}>
            {post.title}{" "}
            <span>
              by <b>{post.authorUsername}</b> on {format(post.datePosted, "Pp")}
            </span>
          </div>
          <hr></hr>
          <p className={styles.content}>{post.content}</p>
        </div>

        <ul className={styles.comments}>
          {comments.map((comment) => {
            return (
              <li key={comment.id} className={styles.comment}>
                <p className={styles.writer}>
                  {comment.writerUsername} <span>commented on {format(comment.dateWritten, "Pp")}:</span>
                </p>
                <hr></hr>
                <p className={styles.commentText}>{comment.content}</p>
              </li>
            );
          })}
          {userLoggedIn === false && (
            <li className={styles.logInMessage}>
              <p>
                <Link to={`/log-in`}>LOG IN</Link> TO COMMENT
              </p>
            </li>
          )}
          {userLoggedIn === true && (
            <li className={styles.newMessage}>
              <form onSubmit={submitComment}>
                <textarea
                  name="comment"
                  placeholder="Enter comment..."
                  onChange={handleComment}
                  value={commentText}
                ></textarea>
                {!isAddingComment && <button>COMMENT</button>}
                {isAddingComment && <button disabled>ADDING COMMENT...</button>}
              </form>
            </li>
          )}
          {commentError && <li className={styles.commentError}><p>{commentError}</p></li>}
        </ul>
      </div>
    );
  }
};

export default Post;
