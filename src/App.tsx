import { Box } from '@mui/material';
import { RootState } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ApiError, getGameChapters, getGameEndings, getGameItems, getGamePages } from './utils/api';

function App() {
  // const location = useLocation();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const toLastPage = async () => {
  //   try {
  //     const { moveTargetType, targetId } = await getStatus();
  
  //     navigate(`/${moveTargetType === 1 ? 'pages' : 'endings'}/${targetId}`);
  //   } catch (e) {
  //     if (e instanceof ApiError && e.status === 404) {
  //       navigate('/chapter/1');
  //     } else {
  //       throw e;
  //     }
  //   }
  // }

  const getGameData = async () => {
    try {
      const chapters = await getGameChapters();
      const pages = await getGamePages();
      const items = await getGameItems();
      const enddings = await getGameEndings();

      dispatch({ type: 'game/setChapters', payload: chapters });
      dispatch({ type: 'game/setPages', payload: pages });
      dispatch({ type: 'game/setItems', payload: items });
      dispatch({ type: 'game/setEndings', payload: enddings });

      // if (!location.pathname.startsWith('/journey')) {
      //   await toLastPage();
      // }

      navigate('/chapter/1');
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        navigate('/login');
      } else {
        console.error('Error fetching game data:', e);
      }
    }
  }


  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      getGameData();
    }
  }, [isLoggedIn]);

  return (
    <>
      <Box component="footer" display="flex" justifyContent="center" alignItems="center" height="100px">
        <Box>© 2025 aeum-gil.com</Box>
        <Box ml="auto">Powered by aeum-gil</Box>
      </Box>
    </>
  );
};

export default App;
