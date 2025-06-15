import { RootState } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { ApiError, getGameChapters, getGameEndings, getGameItems, getGamePages, getStatus } from './utils/api';
// import { Button } from '@mui/material';
import { logout } from './store/authSlice';
import { setOwnedItems } from './store/gameSlice';

function App() {
  const location = useLocation();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toLastPage = useCallback(async () => {
    try {
      const { moveTargetType, targetId, ownedItems } = await getStatus();

      if (ownedItems) dispatch(setOwnedItems(ownedItems));

      const toPageLink = `/${moveTargetType === 1 ? 'pages' : 'ending'}/${targetId}`

      // 현재 위치가 이동할 페이지와 같으면 리턴
      if (location.pathname === toPageLink) return;
  
      navigate(toPageLink);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        navigate('/chapter/1');
      } else {
        throw e;
      }
    }
  }, [dispatch, navigate, location.pathname]);

  const getGameData = useCallback(async () => {
    try {
      const { ownedItems } = await getStatus();

      if (ownedItems) dispatch(setOwnedItems(ownedItems));

      const chapters = await getGameChapters();
      const pages = await getGamePages();
      const items = await getGameItems();
      const enddings = await getGameEndings();

      dispatch({ type: 'game/setChapters', payload: chapters });
      dispatch({ type: 'game/setPages', payload: pages });
      dispatch({ type: 'game/setItems', payload: items });
      dispatch({ type: 'game/setEndings', payload: enddings });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        dispatch(logout());

        navigate('/');
      } else {
        console.error('Error fetching game data:', e);

        dispatch(logout());

        navigate('/');
      }
    }
  }, [dispatch, location.pathname, navigate]);

  // const resetLocalStorage = () => {
  //   localStorage.clear();
  //   window.location.reload();
  // }

  useEffect(() => {
    // 로그인 상태일 시
    if (isLoggedIn) {
      getGameData().then(() => {
        // 로그인 / 회원가입 페이지일 경우 Intro로 이동
        if (location.pathname === '/login' || location.pathname === '/register') {
          navigate('/intro');
        } else if (location.pathname.includes('/pages/') || location.pathname.includes('/ending/')) {
          toLastPage();
        }
      });
    } else if (location.pathname !== '/login' && location.pathname !== '/register') { // 로그인 / 회원가입 페이지가 아닐 경우
      // 랜딩 페이지로 이동
      navigate('/');
    }
  }, [isLoggedIn, getGameData, navigate, location.pathname, toLastPage]);

  return (
    <>
      {/* <Button onClick={resetLocalStorage} sx={{ width: '100%' }}>
        로컬 스토리지 초기화
      </Button> */}
    </>
  );
};

export default App;
