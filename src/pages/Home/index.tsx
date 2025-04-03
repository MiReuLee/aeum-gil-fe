import { Link } from 'react-router-dom';
import { Grid2 } from '@mui/material';
import Logo from '../../components/Logo';
import MainBg from '../../components/MainBg';

export const Home = () => {
  console.log('token', localStorage.token);

  return (
    <>
      <MainBg gap={'8.625rem'}>
        <Logo />

        <Grid2
          container
          width={'24.75rem'}
          alignItems={'center'}
          justifyContent={'center'}
          sx={{
            aspectRatio: '396 / 80',
            backgroundImage: `url('/btn_idle.png')`,
            backgroundSize: 'contain',
            ':hover': {
              backgroundImage: `url('/btn_hover.png')`,
            },
            ':active': {
              backgroundImage: `url('/btn_active.png')`,
              '*': {
                color: '#2d2d2d',
              },
            },
            '*': {
              color: '#cfcfcf',
            },
          }}
        >
          <Link
            to={'/login'}
            style={{ fontWeight: 'bold', fontSize: '1.75rem', textDecoration: 'none' }}>
            시작
          </Link>
        </Grid2>
      </MainBg>
    </>
  );
}
