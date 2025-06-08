import { Grid2 } from '@mui/material';
import { useDispatch } from 'react-redux';
import ButtonUsage from '../../components/Button';
import Logo from '../../components/Logo';
import MainBg from '../../components/MainBg';
import { ApiError, getStatus, restoreGameReords } from '../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { clearPlayedPages, setOwnedItems } from '../../store/gameSlice';

export const Intro = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toLastPage = async () => {
    try {
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
  }

  const handleClickRestore = async () => {
    await restoreGameReords(1)
    
    dispatch(clearPlayedPages());

    navigate('/chapter/1');
  }

  return (
    <>
      <MainBg gap={'8.625rem'}>
        <Logo />

        <Grid2 sx={{ display: 'grid', gap: '1.5rem' }}>
          <ButtonUsage onClick={toLastPage}>
            <span>이어하기</span>
          </ButtonUsage>

          <ButtonUsage onClick={handleClickRestore}>
            <span>새 게임</span>
          </ButtonUsage>
        </Grid2>

        <Grid2 sx={{ display: 'grid', gap: '1.5rem' }}>
          <button>엔딩 목록</button>
          <button>크레딧</button>
        </Grid2>
      </MainBg>
    </>
  );
};
