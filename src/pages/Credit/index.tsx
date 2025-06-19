import { Grid2 } from '@mui/material';
import { Link } from 'react-router-dom';
import { colors } from '../../utils';

export const Credit = () => {
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
          크레딧
        </Grid2>
      </Grid2>

      <Grid2
        container
        flex={1}
        flexDirection={'column'}
        width={'100%'}
        alignItems={'center'}
        justifyContent={'flex-start'}
        gap={2}
        padding={'5rem 0'}
        sx={{
          background: '#161616',
        }}
      >
        <Grid2>
          <img src="/img_credit.png" style={{ maxWidth: '100%' }}></img>
        </Grid2>
        <Grid2
          container
          flexDirection={'column'}
          alignItems={'center'}
          fontSize={'1.2rem'}
          lineHeight={3}
          sx={{
            color: colors.W00,
            '> *:hover': {
              fontSize: '1.3rem',
              transition: 'font-size 0.2s ease-in-out',
              textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
              cursor: 'none',
            }
          }}
        >
          <Grid2>Backend Developer - Han Seung Deok</Grid2>
          <Grid2>Scenario Writer - Chi Ye-eun</Grid2>
          <Grid2>Art & Graphic Design - Shim Ji-hun</Grid2>
          <Grid2>Frontend Developer - Lee Mireu</Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};
