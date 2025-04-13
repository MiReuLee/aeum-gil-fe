import { Button, Grid2, Tab, Tabs } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { putGameRecords, restoreGameReords } from '../../utils/api';
import { $Chapter, $ChoiceOption, $Page } from '../../types';
import Popup from '../../components/Popup';
import { addPlayedPages } from '../../store/gameSlice';

const colors = {
  W00: '#ECECEC',
  W01: '#FFF',
  B01: '#1E1E1E',
  B02: '#2D2D2D',
  B03: '#000',
}

export const Page = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const padding = {
    [theme.breakpoints.up('md')]: {
      padding: `0 ${100 / 6}%`
    }
  };

  const chapters = useSelector((state: RootState) => state.game.chapters);

  const { pageId } = useParams() as { pageId: string };
  const pages = useSelector((state: RootState) => state.game.pages);

  const playedPages = useSelector((state: RootState) => state.game.playedPages);

  const [page, setPage] = useState<$Page | null>(null);
  const [chapter, setChapter] = useState<$Chapter | null>(null);
  const [tabIndex, setTabIndex] = useState(0); // 현재 선택된 탭의 인덱스
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [opacity, setOpacity] = useState(1); // 애니메이션 상태

  useEffect(() => {
    setOpacity(0.7); // 애니메이션 시작

    const timeout = setTimeout(() => {
      if (pageId && pages.length > 0) {
        const _page = pages.find((p) => String(p.pageId) === pageId) as $Page;
  
        if (_page) {
          setPage({
            ..._page,
            ...JSON.parse(_page.content),
          });
        }
      }

      setOpacity(1); // 다시 보이게 설정
    }, 300); // 애니메이션이 끝난 후에 페이지를 설정

    return () => {
      clearTimeout(timeout);
      setOpacity(1); // 애니메이션 종료
    };
  }, [pageId, pages]);

  useEffect(() => {
    if (page) {
      const _chapter = page?.chapter as $Chapter;
      setChapter(_chapter);
    }
  }, [page]);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [playedPages]);

  const handleClickChoiceOption = async (choiceOption: $ChoiceOption) => {
    const _pageId = Number(pageId);

    dispatch(addPlayedPages(_pageId));

    await putGameRecords({ pageId: _pageId, choiceOptionId: choiceOption.choiceOptionId });
  };

  const handleClickRestore = async () => {
    await restoreGameReords(chapters[0].firstPageId)

    setIsPopupOpen(false);
    navigate('/chapter/1');
  }

  return (
    <>
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
          {chapter?.title} - {page?.place}

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
          <img src={page?.img} width={'100%'} height={'100%'} style={{ objectFit: 'cover' }} />
        </Grid2>

        <Grid2 width={'100%'} height={'40%'} whiteSpace={'pre-wrap'} sx={{ overflowY: 'auto', ...padding }} ref={contentRef}>
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
            <div>{
              playedPages.reduce((str, e) => {
                const page = pages.find((p) => p.pageId === e)
            
                if (page) {
                  const { text } = JSON.parse(page.content);
            
                  str += `${text}\n\n`;
                }
            
                return str;
              }, '')
            }</div>
            <div style={{ minHeight: 'calc(40vh - 2rem)' }}>{page?.text}</div>
          </Grid2>
        </Grid2>

        {/* Tab 선택지 / 주머니 / 상태 */}
        <Grid2 container direction={'column'} width={'100%'} flex={1}>
          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              background: colors.B02,
              color: colors.W01,
              ...padding,
              '& .MuiTabs-flexContainer': {
                [theme.breakpoints.down('md')]: {
                  justifyContent: 'space-around',
                }
              },
            }}
          >
            <Tab label="선택지" />
            <Tab label="주머니" />
            <Tab label="상태" />
          </Tabs>

          <Grid2
            display={'grid'}
            container
            flex={1}
            color={colors.W01}
            sx={{
              background: colors.B01,

              padding: '1rem 8%',
              gridTemplateColumns: '1fr',
              gridTemplateRows: 'repeat(4, 1fr)',

              [theme.breakpoints.up('md')]: {
                ...padding[theme.breakpoints.up('md')],
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr'
              }
            }}
          >
            {page?.choiceOptions.map((choiceOption) => (
              <Link
                key={choiceOption.choiceOptionId}
                to={`/${choiceOption.moveTargetType === 1 ? 'pages' : 'ending'}/${choiceOption.targetId}`}
                style={{
                  textDecoration: 'none', color: colors.W01, display: 'flex', alignItems: 'center',
                }}
                onClick={() => handleClickChoiceOption(choiceOption)}
              >
                <Grid2
                  container
                  alignItems={'center'}
                  width={'100%'}
                  height={'100%'}
                  textAlign={'left'}
                  padding={'0 1rem'}
                  sx={{
                    backgroundSize: '100% 100%',
                    fontWeight: 900,
                    ':hover': {
                      backgroundImage: `url('/option_hover.png')`,
                    },
                    ':active': {
                      backgroundImage: `url('/option_active.png')`,
                      color: colors.B02,
                    },
                  }}
                >
                  {choiceOption.content}
                </Grid2>
              </Link>
            ))}
          </Grid2>
        </Grid2>

        {isPopupOpen && (
          <Popup close={() => setIsPopupOpen(false)}>
            <Button
              onClick={handleClickRestore}
            >
              <span style={{
                fontWeight: 900,
                color: colors.B01,
                fontSize: '28px',
              }}>처음부터 시작하기</span>
            </Button>
          </Popup>
        )}
      </Grid2>
    </>
  );
};
