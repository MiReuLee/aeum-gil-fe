import { RootState } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { ApiError, getGameChapters, getGameEndings, getGameItems, getGamePages, getStatus } from './utils/api';
import { Button } from '@mui/material';
import { setOwnedItems } from './store/gameSlice';
import { logout } from './store/authSlice';

// const isDev = true; // process.env.NODE_ENV === 'development';
const isDev = false; // process.env.NODE_ENV === 'development';

function App() {
  const location = useLocation();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toLastPage = useCallback(async () => {
    try {
      if (isDev) return;

      const { moveTargetType, targetId, ownedItems } = await getStatus();
  
      navigate(`/${moveTargetType === 1 ? 'pages' : 'ending'}/${targetId}`);

      if (ownedItems) dispatch(setOwnedItems(ownedItems));
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        navigate('/chapter/1');
      } else {
        throw e;
      }
    }
  }, [navigate]);

  const getGameData = useCallback(async () => {
    try {
      const chapters = await getGameChapters();
      const pages = await getGamePages();
      const items = await getGameItems();
      const enddings = await getGameEndings();

      dispatch({ type: 'game/setChapters', payload: chapters });
      dispatch({ type: 'game/setPages', payload: pages });
      dispatch({ type: 'game/setItems', payload: items });
      dispatch({ type: 'game/setEndings', payload: enddings });

      if (!location.pathname.startsWith('/journey')) {
        await toLastPage();
      }
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        dispatch(logout());

        navigate('/');
      } else {
        console.error('Error fetching game data:', e);
      }
    }
  }, [dispatch, location.pathname, navigate, toLastPage]);

  const resetLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  }

  useEffect(() => {
    if (isLoggedIn) {
      getGameData();
    }
  }, [isLoggedIn]);

  return (
    <>
      <Button onClick={resetLocalStorage} sx={{ width: '100%' }}>
        로컬 스토리지 초기화
      </Button>
    </>
  );
};

export default App;
