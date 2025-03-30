import App from './App.jsx'
import ErrorPage from './components/ErrorPage.jsx';
import Home from './components/Home.jsx';
import LogIn from './components/LogIn.jsx';
import Post from './components/Post.jsx';
import SignUp from './components/SignUp.jsx';

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home/> },
      { path: "log-in", element: <LogIn /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "posts/:postId", element: <Post/>}
    ],
  },
];

export default routes;