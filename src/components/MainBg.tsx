import { Grid2, useTheme } from '@mui/material';

interface MainBgProps {
  children: React.ReactNode;
  gap: string;
  colorBg?: keyof typeof COLOR_BGS;
}

const COLOR_BGS = {
  light: 'rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.45)',
  dark: 'rgba(30, 30, 30, 0.8), rgba(30, 30, 30, 0.45)',
}

const MainBg = ({ children, gap, colorBg = 'light' }: MainBgProps) => {
  const theme = useTheme();

  const handPositions = [
    [{ left: '100%', top: '50%', transform: 'translate(-120%, -200%)' }, { left: '100%', top: '0', transform: 'translate(-150%, 10%)' }],
    [{ left: '50%', top: '0', transform: 'translate(-100%, 20%)' }, { left: '50%', top: '0', transform: 'translate(-120%, -30%)' }],
    [{ left: '100%', top: '50%', transform: 'translate(-120%, 0%) rotate(45deg)' }, { left: '100%', top: '100%', transform: 'translate(-90%, -110%) rotate(45deg)' }],
    [{ left: '50%', top: '100%', transform: 'translate(-150%, -200%) rotate(165deg)' }, { left: '50%', top: '100%', transform: 'translate(-150%, -50%) rotate(205deg)' }],
    [{ left: '0', top: '50%', transform: 'translate(-20%, -70%) rotate(220deg)' }, { left: '0', top: '50%', transform: 'translate(-30%, -60%) rotate(220deg)' }],
  ]

  return (
    <Grid2
      container
      width={'100vw'}
      height={'100vh'}
      sx={{
        backgroundImage: `linear-gradient(${COLOR_BGS[colorBg]}), url(/main_bg.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {handPositions.map((position, index) => (
        <Grid2
          key={index}
          position={'absolute'}
          sx={{
            width: '8rem',
            ...position[0],
            [theme.breakpoints.up('md')]: {
              width: '14.5vw',
              ...position[1],
            },
            ...(colorBg === 'light' ? { opacity: 0.15 } : { filter: 'invert(1)' }),
          }}
        >
          <img
            src={`/img_handprint0${index + 1}.png`}
            style={{ width: '100%' }}
          ></img>
        </Grid2>
      ))}
      
      <Grid2
        container
        direction={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        gap={gap}
        width={'100%'}
        height={'100%'}
        position={'relative'}
      >
        {children}
      </Grid2>
    </Grid2>
  );
};

export default MainBg;
