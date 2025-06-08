import { Button, Grid2, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { colors } from '../utils';
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import Popup from './Popup';
import { restoreGameReords } from '../utils/api';
import { clearPlayedPages } from '../store/gameSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

type ContentsProps = {
  children?: React.ReactNode;
  title: string;
  img: string;
  isEnding: boolean;
  onClick?: () => void;
};

export const Contents = ({ children, title, img, onClick }: ContentsProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [opacity, setOpacity] = useState(0); // 애니메이션 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태

  const contentRef = useRef<HTMLDivElement>(null);

  const chapters = useSelector((state: RootState) => state.game.chapters);
  // const playedPages = useSelector((state: RootState) => state.game.playedPages);

  const padding = {
    [theme.breakpoints.up('md')]: {
      padding: `0 ${100 / 6}%`
    }
  };

  const handleClickRestore = async () => {
      await restoreGameReords(chapters[0].firstPageId)
      
      dispatch(clearPlayedPages());
  
      setIsPopupOpen(false);
      navigate('/chapter/1');
    }

  useEffect(() => {
    setOpacity(1); // 애니메이션 시작

    const timeout = setTimeout(() => {
      setOpacity(1); // 다시 보이게 설정
    }, 300); // 애니메이션이 끝난 후에 페이지를 설정

    return () => {
      clearTimeout(timeout);
      setOpacity(0); // 애니메이션 종료
    };
  }, []);

  return (
      <Grid2
        container
        direction={'column'}
        alignItems={'center'}
        width={'100vw'}
        height={'100vh'}
        textAlign={'left'}
        sx={{
          background: colors.W00, position: 'relative', overflow: 'hidden',
          opacity,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {/* Top Bar */}
        <Grid2
          width={'100%'}
          height={'64px'}
          lineHeight={'64px'}
          color={'#919191'}
          sx={{
            background: colors.B01,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...padding,
            padding: '1rem'
          }}
        >
          {title}

          <Button
            sx={{
              background: `url('/btn_menu.svg')`,
              backgroundSize: 'contain',
              maxWidth: '48px',
              minWidth: '48px',
              height: '48px',
            }}
            onClick={() => setIsPopupOpen(true)}
          />
        </Grid2>

        <Grid2 width={'100%'} height={'23%'} sx={{ background: colors.B03, ...padding }}>
          <img src={img} width={'100%'} height={'100%'} style={{ objectFit: 'cover' }} />
        </Grid2>

        <Grid2
          width={'100%'}
          whiteSpace={'pre-wrap'}
          flex={1}
          sx={{ overflowY: 'auto', background: colors.B03, color: colors.W00, ...padding }}
          ref={contentRef}
          onClick={onClick}
        >
          <Grid2
            sx={{
              wordBreak: 'keep-all',
              lineHeight: '1.8',
              padding: `1rem ${100 / 12}%`,
              [theme.breakpoints.up('sm')]: {
                padding: '1rem', // 화면 크기가 'sm' 이상일 때
              },
            }}
          >
            {children}
          </Grid2>
        </Grid2>

        {isPopupOpen && (
          <Popup close={() => setIsPopupOpen(false)}>
            <Grid2 container style={{  flexDirection: 'column', gap: '3rem' }}>
              <Button onClick={handleClickRestore}>
                <span style={{
                  fontWeight: 900,
                  color: colors.B01,
                  fontSize: '28px',
                }}>처음부터 시작하기</span>
              </Button>

              <Button onClick={() => dispatch(logout())}>
                <span style={{
                  fontWeight: 900,
                  color: colors.B01,
                  fontSize: '28px',
                }}>게임 나가기</span>
              </Button>
            </Grid2>
          </Popup>
        )}
      </Grid2>
    );
}
