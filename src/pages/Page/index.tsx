import { Button, Grid2, Tab, Tabs } from '@mui/material';
import { keyframes, useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { putGameRecords, restoreGameReords } from '../../utils/api';
import { $Chapter, $ChoiceOption, $Page } from '../../types';
import Popup from '../../components/Popup';
import { addPlayedPages, clearPlayedPages, setOwnedItems } from '../../store/gameSlice';
import { logout } from '../../store/authSlice';
import { colors } from '../../utils';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

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
  const ownedItems = useSelector((state: RootState) => state.game.ownedItems);
  const items = useSelector((state: RootState) => state.game.items);

  const playedPages = useSelector((state: RootState) => state.game.playedPages);

  const [page, setPage] = useState<$Page | null>(null);
  const [chapter, setChapter] = useState<$Chapter | null>(null);
  const [tabIndex, setTabIndex] = useState(0); // 현재 선택된 탭의 인덱스
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [visible, setVisible] = useState(true); // 페이지 전환 시 fadeOut 애니메이션을 위한 상태

  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const newPage = pages.find((p) => String(p.pageId) === pageId) as $Page;
    if (newPage) {
      setPage({ ...newPage, ...JSON.parse(newPage.content) });
      setVisible(false);
    }
  }, [pageId, pages])
  
  
  useEffect(() => {
    if (!page) return;

    const _chapter = page?.chapter as $Chapter;
    setChapter(_chapter);

    // 데이터가 바뀌면 visible을 true로 설정
    setVisible(true);

    // 3초 뒤에 false로 변경하여 opacity 0 적용
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [page]);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [playedPages]);

  const handleClickChoiceOption = async (choiceOption: $ChoiceOption) => {
    const _pageId = Number(pageId);

    // 별도 예외 처리
    // - 손전등(11) 소지 체크 필요 : 167, 190 페이지
    // - 무기(12) 소지 체크 필요 : 210, 254 페이지
    // - 167 페이지 : 187
    // - 190 페이지 : 218
    // - 210 페이지 : 242
    // - 254 페이지 : 275
    if ((pageId === '167' && choiceOption.choiceOptionId === 187) || (pageId === '190' && choiceOption.choiceOptionId === 218)) {
      const hasFlashlight = ownedItems.some(item => item.itemId === 11);
      if (!hasFlashlight) {
        alert('손전등이 필요합니다.');
        return;
      }
    } else if ((pageId === '210' && choiceOption.choiceOptionId === 242) || (pageId === '254' && choiceOption.choiceOptionId === 275)) {
      const hasWeapon = ownedItems.some(item => item.itemId === 12);
      if (!hasWeapon) {
        alert('무기가 필요합니다.');
        return;
      }
    }

    // 선택지에 필요한 아이템이 있는지 확인
    const requiredItems = choiceOption.items.filter(e => e.actionType === 2);

    if (requiredItems.length) {
      const hasAllItems = requiredItems.every(item => ownedItems.some(ownedItem => ownedItem.itemId === item.itemId));

      if (!hasAllItems) {
        alert('필요한 아이템이 부족합니다.');
        return;
      }
    }
    
    const {
      moveTargetType: _moveTargetType, ownedItems: ownedItems2, targetId: _targetId
    } = await putGameRecords({ pageId: _pageId, choiceOptionId: choiceOption.choiceOptionId });
    
    dispatch(addPlayedPages(_pageId));
    if (ownedItems2) dispatch(setOwnedItems(ownedItems2));
    navigate(`/${_moveTargetType === 1 ? 'pages' : 'ending'}/${_targetId}`);
  };

  const handleClickRestore = async () => {
    await restoreGameReords(chapters[0].firstPageId)
    
    dispatch(clearPlayedPages());

    setIsPopupOpen(false);
    navigate('/chapter/1');
  }

  const handleClickExit = () => dispatch(logout());

  const getItemDetails = (itemId: number) => items.find(i => i.id === itemId);

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
        }}
      >
        {visible && (<Grid2
          position={'absolute'}
          top={0}
          left={0}
          width={'100%'}
          height={'100%'}
          zIndex={1}
          sx={{
            background: '#000',
            pointerEvents: 'none',
            animation: `${fadeOut} 2s ease-in-out forwards`,
          }}
        />)}

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
          <span
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >{chapter?.title} - {page?.place}</span>

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

        <Grid2
          width={'100%'}
          whiteSpace={'pre-wrap'}
          flex={1}
          sx={{ overflowY: 'auto', ...padding }}
          ref={contentRef}
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
            <Grid2>{
              playedPages.reduce((str, e) => {
                const page = pages.find((p) => p.pageId === e)
            
                if (page) {
                  const { text } = JSON.parse(page.content);
            
                  str += `${text}\n\n`;
                }
            
                return str;
              }, '')
            }</Grid2>
            <Grid2 container sx={{ minHeight: `calc(${contentHeight}px - 2rem)` }}>
              {page?.object && (
                <img 
                  src={page.object}
                  style={{ height: `calc(${contentHeight}px - 4rem)` }}
                />
              )}
              <Grid2 flex={1}>{page?.text}</Grid2>
            </Grid2>
          </Grid2>
        </Grid2>

        {/* Tab 선택지 / 주머니 */}
        <Grid2 container maxHeight={'300px'} direction={'column'} width={'100%'} flex={1} overflow={'hidden'}>
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
                ...(tabIndex === 0 ? {
                  gridTemplateRows: '1fr 1fr'
                } : {
                  overflow: 'auto',
                  gap: '1rem',
                  padding: `1rem ${100 / 6}%`
                })
                
                
              },

              [theme.breakpoints.down('md')]: (tabIndex === 1 ? {
                overflow: 'auto',
                gap: '0.5rem'
              } : {})
            }}
          >
            {tabIndex === 0 ? (
              page?.choiceOptions.map((choiceOption) => (
                <Grid2
                  component={Button}
                  key={choiceOption.choiceOptionId}
                  container
                  alignItems={'center'}
                  justifyContent={'flex-start'}
                  width={'100%'}
                  height={'100%'}
                  textAlign={'left'}
                  padding={'0 1rem'}
                  disableRipple
                  sx={{
                    opacity: 0,
                    animation: `${fadeIn} 3s ease-in-out forwards`,
                    backgroundSize: '100% 100%',
                    fontWeight: 900,
                    color: colors.W01,
                    backgroundColor: 'transparent',
                    ':hover': {
                      backgroundImage: `url('/option_hover.png')`,
                    },
                    ':active': {
                      backgroundImage: `url('/option_active.png')`,
                      color: colors.B02,
                    },
                  }}
                  onClick={() => handleClickChoiceOption(choiceOption)}
                >
                  {choiceOption.content}
                </Grid2>))
              ) : (
                ownedItems && ownedItems.length ? (
                  ownedItems.map((item) => {
                  const _item = getItemDetails(item.itemId)

                  if (!_item) return null;

                  return (
                    <Grid2
                      component={Button}
                      key={item.itemId}
                      container
                      alignItems={'center'}
                      justifyContent={'flex-start'}
                      width={'100%'}
                      height={'100%'}
                      textAlign={'left'}
                      padding={'0 1rem'}
                      disableRipple
                      sx={{
                        opacity: 0,
                        animation: `${fadeIn} 3s ease-in-out forwards`,
                        backgroundSize: '100% 100%',
                        fontWeight: 900,
                        color: colors.W01,
                        backgroundColor: 'transparent',
                        ':hover': {
                          backgroundImage: `url('/option_hover.png')`,
                        },
                        ':active': {
                          backgroundImage: `url('/option_active.png')`,
                          color: colors.B02,
                        },
                      }}
                    >
                      <img
                        src={_item.image}
                        alt={_item.name}
                        style={{ width: '4rem', height: '4rem', marginRight: '0.5rem' }}
                      />
                      <Grid2 container direction={'column'} flex={1}>
                        <Grid2 sx={{ fontSize: '1.2rem' }}>{_item.name}</Grid2>
                        <Grid2 sx={{ color: '#919191' }}>
                          <span dangerouslySetInnerHTML={{ __html: _item.description.replace(/\\n/gi, '<br />') }} />
                        </Grid2>
                      </Grid2>
                    </Grid2>
                  )
                })
                ) : (
                  <Grid2
                    container
                    alignItems={'center'}
                    justifyContent={'center'}
                    width={'100%'}
                    height={'100%'}
                    gridRow={'1 / 3'}
                    gridColumn={'1 / 3'}
                    sx={{ color: colors.W01, fontWeight: 900 }}
                  >
                    주머니가 비어있습니다.
                  </Grid2>
                )
              )
            }
          </Grid2>
        </Grid2>

        {isPopupOpen && (
          <Popup close={() => setIsPopupOpen(false)}>
            <Grid2 container style={{  flexDirection: 'column', gap: '3rem' }}>
              <Button
                onClick={handleClickRestore}
              >
                <span style={{
                  fontWeight: 900,
                  color: colors.B01,
                  fontSize: '28px',
                }}>처음부터 시작하기</span>
              </Button>

              <Button
                onClick={handleClickExit}
              >
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
    </>
  );
};
