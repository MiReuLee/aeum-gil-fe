import { Grid2, keyframes } from '@mui/material';

interface MainBgProps {
  children: React.ReactNode;
  gap: string;
  colorBg?: keyof typeof COLOR_BGS;
}

const COLOR_BGS = {
  light: 'rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.45)',
  dark: 'rgba(30, 30, 30, 0.8), rgba(30, 30, 30, 0.45)',
}

const growAnimation = keyframes`
  0% {
    transform: rotate(-25deg) translateX(-50%) scale(1);
  }
  100% {
    transform: rotate(-25deg) translateX(-50%) scale(1.2);
  }
`;
const growAnimation2 = keyframes`
  0% {
    transform: rotate(25deg) scale(1);
  }
  100% {
    transform: rotate(25deg) scale(1.2);
  }
`;

const MainBg = ({ children, gap, colorBg }: MainBgProps) => {
  return (
    <Grid2
      container
      direction={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      gap={gap}
      width={'100vw'}
      height={'100vh'}
      sx={{
        backgroundImage: `linear-gradient(${COLOR_BGS[colorBg || 'light']}), url(/main_bg.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}

      <Grid2
        sx={{
          position: 'absolute', bottom: '-90px', left: 'calc(50% - 200px)',
          // 1초 간격으로 무한 반복
          animation: `${growAnimation} 1s forwards`,
          animationDelay: '0.5s',
          animationIterationCount: 'infinite',
          animationDirection: 'alternate',
          animationTimingFunction: 'ease-in-out',
          animationFillMode: 'forwards',
          animationPlayState: 'running',
          ...(colorBg === 'light' ? {} : { filter: 'invert(1)' }),
        }}
      >
        <img
          src="/hand.png"
        ></img>
      </Grid2>

      <Grid2 sx={{
        position: 'absolute', bottom: '-90px', left: '80%', animation: `${growAnimation2} 1s forwards`,
        ...(colorBg === 'light' ? {} : { filter: 'invert(1)' }),
        }}>
        <img
          src="/hand.png"
        ></img>
      </Grid2>
    </Grid2>
  );
};

export default MainBg;
