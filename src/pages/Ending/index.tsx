import { Grid2 } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import MainBg from '../../components/MainBg';
import { RootState } from '../../store';
import { $Ending } from '../../types';
import ButtonUsage from '../../components/Button';
import { restoreGameReords } from '../../utils/api';

export const Ending = () => {
  const navigate = useNavigate();

  const { endingId } = useParams() as { endingId: string };
  const endings = useSelector((state: RootState) => state.game.endings);

  const [ending, setEnding] = useState<$Ending | null>(null);

  useEffect(() => {
    if (endings.length) {
      const _ending = endings[Number(endingId) - 1] as $Ending;

      if (_ending) {
        const { text, img } = JSON.parse(_ending.content);
        setEnding({
          ..._ending,
          text,
          img,
        });
      }
    }
  }, [endings, endingId]);

  const handleClick = async () => {
    if (!ending) return

    await restoreGameReords(ending.returnPageId);

    navigate(`/pages/${ending.returnPageId}`);
  }

  return (
    <Grid2 container>
      <MainBg gap={'0'} colorBg='dark'>
        <h1 className="old-newspaper" style={{ color: '#ebebeb', fontSize: '88px' }}>The End</h1>
        
        <Grid2 container color={'#ebebeb'}>
          <Grid2>{ending?.title}</Grid2>
          <Grid2>{ending?.text}</Grid2>
        </Grid2>

        <ButtonUsage onClick={handleClick}>
          <span>
            이전 선택으로 돌아가기
          </span>
        </ButtonUsage>
      </MainBg>
    </Grid2>
  );
};
