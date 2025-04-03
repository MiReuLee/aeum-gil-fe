import { Button, Grid2 } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import MainBg from '../../components/MainBg';
import { RootState } from '../../store';
import { $Ending } from '../../types';

export const Ending = () => {
  const navigate = useNavigate();

  const { endingId } = useParams() as { endingId: string };
  const endings = useSelector((state: RootState) => state.game.endings);

  const [ending, setEnding] = useState<$Ending | null>(null);

  useEffect(() => {
    if (endings.length) {
      setEnding(endings[Number(endingId) - 1] as $Ending);
    }
  }, [endings]);

  const handleClick = async () => {
    if (!ending) return

    navigate(`/pages/${ending.returnPageId}`);
  }

  return (
    <Grid2 container>
      <MainBg gap={'0'} colorBg='dark'>
        <h1 className="old-newspaper" style={{ color: '#ebebeb', fontSize: '88px' }}>The End</h1>

        <Button onClick={handleClick}>
        </Button>
      </MainBg>
    </Grid2>
  );
};
