import { Button, Grid2 } from '@mui/material';

type ButtonUsageProps = {
  type?: 'submit' | 'button';
  children: React.ReactNode;
};

export default function ButtonUsage({ type = 'button', children }: ButtonUsageProps) {
  return <Grid2
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
        fontWeight: 'bold',
        fontSize: '1.75rem',
        color: '#cfcfcf',
      },
    }}
  >
    <Button sx={{ width: '100%', height: '100%' }} disableRipple type={type}>
      {children}
    </Button>
  </Grid2>;
}
