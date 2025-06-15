import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { $Ending } from '../../types';
import { restoreGameReords, putEndingRecords } from '../../utils/api';
import { clearPlayedPages } from '../../store/gameSlice';
import { Contents } from '../../components/Contents';
import { Grid2 } from '@mui/material';
import MainBg from '../../components/MainBg';
import ButtonUsage from '../../components/Button';

export const Ending = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { endingId } = useParams() as { endingId: string };
  const endings = useSelector((state: RootState) => state.game.endings);

  const [ending, setEnding] = useState<$Ending | null>(null);

  const [isShowContents, setIsShowContents] = useState(true);

  useEffect(() => {
    // 엔딩 진입 시 로컬 게임 기록 초기화
    dispatch(clearPlayedPages());
  }, [dispatch]);

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

        putEndingRecords(Number(endingId))
      }
    }
  }, [endings, endingId]);

  const handleClick = async (returnPageId?: number) => {
    if (!ending) return

    if (isShowContents) {
      setIsShowContents(false);
      return;
    }
    
    returnPageId ??= ending.returnPageId;

    await restoreGameReords(returnPageId);

    navigate(`/pages/${returnPageId}`);
  }

  const toIntro = () => navigate('/intro');

  return (
    isShowContents ? (
      <Contents
        title={ending?.title || ''}
        img={ending?.img || ''}
        onClick={handleClick}
      >
        {ending?.text}
      </Contents>
    ) : (
      <Grid2 container>
        <MainBg gap={'0'} colorBg='dark'>
          <h1 className="old-newspaper" style={{ color: '#ebebeb', fontSize: '88px' }}>The End</h1>

          {endingId === '8' || endingId === '9' ? (
            <Grid2 container spacing={2}>
              <ButtonUsage onClick={toIntro}>
                <span>
                  이대로 끝내기
                </span>
              </ButtonUsage>

              <ButtonUsage onClick={() => handleClick(229)}>
                <span>
                  다시 선택하기
                </span>
              </ButtonUsage>
            </Grid2>
          ) : (
            <ButtonUsage onClick={() => handleClick()}>
              <span>
                이전 선택으로 돌아가기
              </span>
            </ButtonUsage>
          )}
          
        </MainBg>
      </Grid2>
    )
  )
};
