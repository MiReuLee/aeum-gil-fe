import { Grid2 } from '@mui/material';
import { useDispatch } from 'react-redux';
import ButtonUsage from '../../components/Button';
import Logo from '../../components/Logo';
import MainBg from '../../components/MainBg';
import { ApiError, getStatus, restoreGameReords } from '../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { clearPlayedPages, setOwnedItems } from '../../store/gameSlice';
import { colors } from '../../utils';

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

        <Grid2
          position={'relative'}
          width={'100%'}
          display={'flex'}
          justifyContent={'center'}
          sx={{
            gap: '1.5rem',
            ':after': {
              content: '""',
              width: '100%',
              height: '2px',
              background: 'url(/border_intro_btn.png) no-repeat center center',
              position: 'absolute',
              bottom: '-10px',
            },
            '> *': {
              textDecoration: 'none',
              color: colors.B01,
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }
          }}
        >
          <Link to={'/ending-list'}>엔딩 목록</Link>
          <Link to={'/credit'}>크레딧</Link>
        </Grid2>
      </MainBg>
    </>
  );
};
