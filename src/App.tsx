import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import LoginRegisterLayout from './components/RouteElements/LoginRegisterLayout';
import AppLayout from './components/RouteElements/AppLayout';
import HomeLayout from './components/RouteElements/HomeLayout';
import HomePosts from './pages/HomePosts';
import HomeDiscover from './pages/HomeDiscover';
import UserLayout from './components/RouteElements/UserLayout';
import PostPage from './pages/PostPage';
import CreatePost from './components/CreatePostMock';
import ProtectedRoute from './components/RouteElements/ProtectedRoute';
import LoginRoute from './components/RouteElements/LoginRoute';
import MainLayuot from './components/RouteElements/MainLayout';
import UserPosts from './pages/UserPosts';
import UserPostReplies from './pages/UserPostReplies';
import UserMediaPosts from './pages/UserMediaPosts';
import UserReposts from './pages/UserReposts';
import UserLikedPosts from './pages/UserLikedPosts';
import SearchLayout from './components/RouteElements/SearchLayout';
import SearchUsers from './pages/SearchUsers';
import SearchLatestPosts from './pages/SearchLatestPosts';
import SearchTopPosts from './pages/SearchTopPosts';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayuot />}>
      <Route
        path='/'
        element={
          <LoginRoute>
            <LoginRegisterLayout />
          </LoginRoute>
        }
      >
        <Route index element={<Login />} />
        <Route
          path='/register'
          element={
            <LoginRoute>
              <Register />
            </LoginRoute>
          }
        />
      </Route>

      <Route
        path='/app'
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route element={<HomeLayout />}>
          <Route index element={<HomePosts />} />
          <Route path='discover' element={<HomeDiscover />} />
        </Route>

        <Route element={<UserLayout />} path='user'>
          <Route path=':id' element={<UserPosts />} />
          <Route path=':id/replies' element={<UserPostReplies />} />
          <Route path=':id/reposts' element={<UserReposts />} />
          <Route path=':id/media' element={<UserMediaPosts />} />
          <Route path=':id/likes' element={<UserLikedPosts />} />
        </Route>

        <Route element={<SearchLayout />} path='search'> 
          <Route index element={<SearchTopPosts />} />
          <Route path='users' element={<SearchUsers />} />
          <Route path='latest' element={<SearchLatestPosts />} />
        </Route>

        <Route path='post/:id' element={<PostPage />} />
        <Route path='createpost' element={<CreatePost />} />
      </Route>
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
