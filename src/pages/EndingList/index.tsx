import { Grid2 } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getGameEndingsNonCache } from '../../utils/api';
import { Link } from 'react-router-dom';
import { setEndings } from '../../store/gameSlice';
import { colors } from '../../utils';
import { useEffect } from 'react';
import { RootState } from '../../store';

export const EndingList = () => {
  const dispatch = useDispatch();
  const endings = useSelector((state: RootState) => state.game.endings
    .filter(ending => !ending.isCleared)
    .map(e => ({ ...e, ...JSON.parse(e.content) }))
  );

  useEffect(() => {
    getGameEndingsNonCache().then((_endings) => {
      dispatch(setEndings(_endings));
    })
  }, [dispatch]);

  return (
    <Grid2
      container
      direction={'column'}
      alignItems={'center'}
      width={'100vw'}
      height={'100vh'}
      textAlign={'left'}
      sx={{
        background: colors.W00, position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top Bar */}
      <Grid2
        width={'100%'}
        height={'64px'}
        lineHeight={'64px'}
        color={'#919191'}
        sx={{
          background: colors.B01,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem'
        }}
      >
        <Link
          to={'/intro'}
          style={{
            height: '100%',
            background: 'url(/btn_back.png) no-repeat center center',
            backgroundSize: 'contain',
            aspectRatio: '1 / 1',
          }}
        />

        <Grid2
          position={'absolute'}
          left={'50%'}
          sx={{
            transform: 'translateX(-50%)',
          }}
        >
          엔딩 목록
        </Grid2>
      </Grid2>

      <Grid2
        container
        flex={1}
        width={'100%'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          background: 'url(/ending_list_bg.png) no-repeat center center',
          backgroundSize: 'cover',
        }}
      >
        {endings.length
          ? (
            <Grid2 container flexWrap={'nowrap'} height={'100%'} sx={{ overflowX: 'auto' }} padding={'3rem'} gap={'1rem'}>
              {endings.map((ending) => (
                <Grid2
                  key={ending.orderNum}
                  width={'200px'}
                  minWidth={'200px'}
                  sx={{
                    background: `url(${ending.recordImg}) no-repeat center center`,
                    backgroundSize: 'contain',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    aspectRatio: '74 / 113',
                    ':nth-child(even)': {
                      marginTop: '150px',
                    },
                  }}
                />
            ))}
            </Grid2>
          )
          : (
            <Grid2
              color={colors.W01}
              textAlign={'center'}
              lineHeight={3}
            >완료한 엔딩이 없습니다. <br/> 게임을 진행해 주세요.</Grid2>
          )}
      </Grid2>
    </Grid2>
  );
};
