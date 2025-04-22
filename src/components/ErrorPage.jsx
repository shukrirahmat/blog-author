import styles from "../styles/ErrorPage.module.css";
import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className={styles.base}>
        <h2>Oops! This Route Does Not exist</h2>
        <Link to={"/"}>Return to Home</Link>
        </div>
    )
}

export default ErrorPage;