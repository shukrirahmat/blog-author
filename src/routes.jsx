import App from './App.jsx'
import ErrorPage from './components/ErrorPage.jsx';
import Home from './components/Home.jsx';
import LogIn from './components/LogIn.jsx';
import Post from './components/Post.jsx';
import UserPosts from './components/UserPosts.jsx';
import ProtectedPost from './components/ProtectedPost.jsx';
import NewPost from './components/NewPost.jsx';

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home/> },
      { path: "log-in", element: <LogIn /> },
      { path: "myposts", element: <UserPosts/>},
      { path: "posts/:postId", element: <Post/>},
      { path: "myposts/new", element: <NewPost/>},
      { path: "myposts/:postId", element: <ProtectedPost/>},
    ],
  },
];

export default routes;