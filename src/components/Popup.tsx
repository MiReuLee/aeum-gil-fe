import { Dialog, DialogContent, Grid2 } from '@mui/material';

type PopupProps = {
  children: React.ReactNode;
  close: () => void;
};

export default function Popup({ children, close }: PopupProps) {
  return <Dialog
    open={true}
    onClose={close}
    PaperProps={{
      sx: {
        width: '640px',
        aspectRatio: '640 / 480',
        backgroundImage: `url('/popup_bg.png')`,
        backgroundSize: 'contain',
      },
    }}
  >
    <DialogContent>
      <Grid2
        container
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'100%'}
      >
        {children}
      </Grid2>
    </DialogContent>
  </Dialog>;
}
