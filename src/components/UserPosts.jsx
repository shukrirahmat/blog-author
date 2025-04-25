import { useEffect, useState } from "react";
import fetchURL from "../fetchURL";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/UserPosts.module.css";
import { format } from "date-fns";

const UserPosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const token = window.localStorage.getItem("token");

    if (!token) {
      navigate("/log-in");   
      navigate(0); 
    } else {
      fetch(fetchURL + "/posts/userPosts", {
        mode: "cors",
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unable to load posts. Server Error");
          }
          return response.json();
        })
        .then((data) => {
          setPosts(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }
  }, []);

  if (isLoading) {
    return (
      <p className={styles.message}>
        Loading Posts...{" "}
        <span>(It'll take longer first time because the server is asleep)</span>
      </p>
    );
  } else if (error) {
    return <p className={styles.message}>{error}</p>;
  } else {
    return (
      <div className={styles.home}>
        <div className={styles.leftbox}>
          <h1>My Posts</h1>
          <ul className={styles.postsContainer}>
            {posts.map((post) => {
              if (post.published) {
                return (
                  <Link to={`/myposts/${post.id}`} key={post.id}>
                    <li className={styles.post}>
                      <div className={styles.postTitle}>
                        {post.title}{" "}
                        <span className={styles.publishedTag}>
                          <div className={styles.tick}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <title>check-bold</title>
                              <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                            </svg>
                          </div>
                          published on {format(post.datePosted, "Pp")}
                        </span>
                      </div>
                      <hr></hr>
                      <p className={styles.content}>{post.content}</p>
                    </li>
                  </Link>
                );
              } else {
                return (
                  <Link to={`/myposts/${post.id}`} key={post.id}>
                    <li className={styles.post}>
                      <div className={styles.postTitle}>
                        {post.title}{" "}
                        <span className={styles.unpublishedTag}>
                          not published
                        </span>
                      </div>
                      <hr></hr>
                      <p className={styles.content}>{post.content}</p>
                    </li>
                  </Link>
                );
              }
            })}
          </ul>
        </div>
        <div className={styles.rightbox}>
          {posts.map((post) => {
            return (
              <Link to={`/myposts/${post.id}`} key={post.id}>
                {post.title}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
};

export default UserPosts;
