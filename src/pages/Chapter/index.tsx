import { Grid2 } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import MainBg from '../../components/MainBg';
import { RootState } from '../../store';
import { $Chapter } from '../../types';

export const Chapter = () => {
  const navigate = useNavigate();

  const { chapterId } = useParams() as { chapterId: string };
  const chapters = useSelector((state: RootState) => state.game.chapters);

  const [chapter, setChapter] = useState<$Chapter | null>(null);

  useEffect(() => {
    if (chapters.length) {
      setChapter(chapters[Number(chapterId) - 1] as $Chapter);
    }
  }, [chapters, chapterId]);

  const handleClick = async () => {
    if (!chapter) return

    navigate(`/pages/${chapter.firstPageId}`);
  }

  return (
    <Grid2 container onClick={handleClick}>
      <MainBg gap={'0'} colorBg='dark'>
        <h1 style={{ color: '#919191', fontSize: '36px' }}>Chapter {chapterId}</h1>

        <h2 style={{ color: '#fff', fontSize: '36px' }}>[ {chapter?.title} ]</h2>
      </MainBg>
    </Grid2>
  );
};
