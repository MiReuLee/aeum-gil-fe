import { Link } from 'react-router-dom';
import { Grid2 } from '@mui/material';
import Logo from '../../components/Logo';
import MainBg from '../../components/MainBg';
import ButtonUsage from '../../components/Button';

export const Home = () => {
  return (
    <>
      <MainBg gap={'8.625rem'}>
        <Logo />

        <Grid2 sx={{ display: 'grid', gap: '1.5rem' }}>
          <ButtonUsage>
            <Link
              to={'/login'}
              style={{
                textDecoration: 'none',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <span>로그인</span>
            </Link>
          </ButtonUsage>

          <ButtonUsage>
            <Link
              to={'/register'}
              style={{
                textDecoration: 'none',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <span>회원가입</span>
            </Link>
          </ButtonUsage>
        </Grid2>
      </MainBg>
    </>
  );
}
