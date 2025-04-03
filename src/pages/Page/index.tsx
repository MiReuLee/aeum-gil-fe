import { Button, Grid2, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { putGameRecords } from '../../utils/api';
import { $ChoiceOption, $Page } from '../../types';
import Popup from '../../components/Popup';

const padding = `0 ${100 / 3 / 2}%`;

const colors = {
  W00: '#ECECEC',
  W01: '#FFF',
  B01: '#1E1E1E',
  B02: '#2D2D2D',
  B03: '#000',
}

export const Page = () => {
  const navigate = useNavigate();

  const { pageId } = useParams() as { pageId: string };
  const pages = useSelector((state: RootState) => state.game.pages);

  const [page, setPage] = useState<$Page | null>(null);
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

  const handleClickChoiceOption = async (choiceOption: $ChoiceOption) => {
    await putGameRecords({ pageId: Number(pageId), choiceOptionId: choiceOption.choiceOptionId });
  };

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
        <Grid2 width={'100%'} height={'64px'} lineHeight={'64px'} color={'#919191'} sx={{
          background: colors.B01,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }} padding={padding}>
          {page?.title}

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

        <Grid2 width={'100%'} height={'23%'} padding={padding} sx={{ background: colors.B03 }}>
          <img src={page?.img} width={'100%'} height={'100%'} style={{ objectFit: 'cover' }} />
        </Grid2>

        <Grid2 width={'100%'} height={'40%'} whiteSpace={'pre-wrap'} padding={padding}>
          <div style={{ padding: '1rem' }}>
            {page?.text}
          </div>
        </Grid2>

        {/* Tab 선택지 / 주머니 / 상태 */}
        <Grid2 container direction={'column'} width={'100%'} flex={1}>
          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            textColor="inherit"
            indicatorColor="primary"
            sx={{ background: colors.B02, padding, color: colors.W01 }}
          >
            <Tab label="선택지" />
            <Tab label="주머니" />
            <Tab label="상태" />
          </Tabs>

          <Grid2
            display={'grid'}
            container
            gridTemplateColumns={'1fr 1fr'}
            flex={1} sx={{ background: colors.B01 }} padding={padding}
            color={colors.W01}
          >
            {page?.choiceOptions.map((choiceOption) => (
              <Link
                key={choiceOption.choiceOptionId}
                to={`/${choiceOption.moveTargetType === 1 ? 'pages' : 'ending'}/${choiceOption.targetId}`}
                style={{
                  textDecoration: 'none', color: colors.W01, display: 'flex', alignItems: 'center',
                  maxHeight: '88px'
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
              onClick={() => {
                setIsPopupOpen(false);
                navigate('/chapter/1');
              }}
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
