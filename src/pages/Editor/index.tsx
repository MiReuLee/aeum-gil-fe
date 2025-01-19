import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid2,
  Divider,
  styled,
  Autocomplete,
  Snackbar,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { CloudUpload, Add, Remove } from '@mui/icons-material';

type ChoiceOption = {
  id?: number;
  nextPageId: number;
  orderNum: number;
  content: string;
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const uploadFileToS3 = async (file: File, presignedUrl: string) => {
  try {
    const res = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!res.ok) {
      throw new Error('Failed to upload file to S3');
    }

    console.log('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const getPresignedUrlFromApi = (fileName: string) => {
  return fetch(`http://api.aeum-gil.com/files/presigned-url?fileName=${fileName}&imageType=page`)
    .then(res => res.text());
}

export function Editor() {
  const params = useParams();
  const navigate = useNavigate();

  const [pageId, setPageId] = useState(-1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [additionalContent, setAdditionalContent] = useState<{ img?: string }>({});
  // 선택지 목록
  const [choiceOptions, setChoiceOptions] = useState<ChoiceOption[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pages, setPages] = useState<{ label: string, id: number }[]>([]);

  const [hasImage, setHasImage] = useState(false);

  const [isShowWide, setIsShowWide] = useState(localStorage.isShowWide === 'true');

  const imageRef = useRef<HTMLImageElement>(null);

  const getPages = async () => {
    return (await (await fetch('http://api.aeum-gil.com/pages', {
      headers: {
        'Content-Type': 'application/json',
      }
    })).json()).map((page: any) => ({ id: page.id, label: `${page.title} (${page.id})` }));
  }

  const getPage = async () => {
    return await (await fetch(`http://api.aeum-gil.com/pages/${params.pageId}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    })).json();
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const contentJson = JSON.stringify({
      text: content,
      ...additionalContent,
    });

    if (pageId === -1) { // 페이지 등록
      const res = await fetch('http://api.aeum-gil.com/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content: contentJson,
        }),
      });
  
      const pageId = parseInt(await res.text());
  
      await Promise.all(choiceOptions.map(async (choiceOption) => {
        await fetch('http://api.aeum-gil.com/choice-options', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...choiceOption, pageId }),
        });
      }));

      setSuccess('페이지가 등록되었습니다.')
  
      // router push to new page
      navigate(`/pages/${pageId}`);
    } else { // 페이지 수정
      await fetch(`http://api.aeum-gil.com/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content: contentJson,
        }),
      });
  
      await Promise.all(choiceOptions.map(async (choiceOption) => {
        if (choiceOption.id) {
          await fetch(`http://api.aeum-gil.com/choice-options/${choiceOption.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(choiceOption),
          });
        } else {
          await fetch('http://api.aeum-gil.com/choice-options', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...choiceOption, pageId }),
          });
        }
      }));

      setSuccess('페이지가 수정되었습니다.')
    }
  };

  const handleDelete = async () => {
    await fetch(`http://api.aeum-gil.com/pages/${pageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await Promise.all(choiceOptions.map(async (choiceOption) => {
      if (choiceOption.id) {
        await fetch(`http://api.aeum-gil.com/choice-options/${choiceOption.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }));

    setSuccess('페이지가 삭제되었습니다.');

    navigate('/pages');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const presignedUrl = await getPresignedUrlFromApi(file.name);

      await uploadFileToS3(file, presignedUrl);

      setAdditionalContent({ img: presignedUrl.substring(0, presignedUrl.indexOf('?')) });
    }
  };

  const handleImageClick = () => {
    if (imagePreview && imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const { innerWidth, innerHeight } = window;

      let popupWidth = naturalWidth;
      let popupHeight = naturalHeight;

      if (innerWidth < naturalWidth) {
        popupWidth = innerWidth;
        popupHeight = (innerWidth / naturalWidth) * naturalHeight;
      } else if (innerHeight < naturalHeight) {
        popupHeight = innerHeight;
        popupWidth = (innerHeight / naturalHeight) * naturalWidth;
      }

      const popup = window.open('', '', `width=${popupWidth},height=${popupWidth}`);
      console.log(`width=${popupWidth},height=${popupWidth}`);

      if (popup) {
        popup.document.write(`<img src="${imagePreview}" alt="이미지 미리보기" style="width: 100%; height: 100%; object-fit: contain" />`);
      }
    }
  };

  useEffect(() => {
    getPages().then((data) => {
      setPages(data);
    });

    if (!params.pageId) {
      return;
    }

    getPage().then(({ id, title, description, content, choiceOptions }) => {
      setPageId(id);
      setTitle(title);
      setDescription(description);
      setChoiceOptions(choiceOptions);
      const { text, img } = JSON.parse(content);
      setContent(text);
      setAdditionalContent({ img });
      setHasImage(!!img);
    });
  }, []);

  useEffect(() => {
    localStorage.isShowWide = isShowWide;
  }, [isShowWide]);

  return (
    <Grid2 container spacing={2} gridTemplateColumns={isShowWide ? '1fr' : '1fr 1fr'} display={'grid'}>
      <Grid2
        container
        component='form'
        onSubmit={handleSubmit}
        sx={{ border: '1px solid #ddd', borderRadius: 2 }}
        size={6}
        spacing={2}
        padding={2}
        width={'100%'}
      >
        <Typography variant='h5' gutterBottom>
          에디터
        </Typography>

        <TextField
          label='제목'
          variant='outlined'
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          inputProps={{
            maxLength: 200,
          }}
          required
        />
        <TextField
          label='페이지 설명'
          variant='outlined'
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          inputProps={{
            maxLength: 100,
          }}
          required
        />
        <TextField
          label='본문'
          variant='outlined'
          fullWidth
          multiline
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {imagePreview && (
          <Grid2 container width={1} maxHeight={'300px'} overflow={'hidden'} justifyContent={'center'}>
            <img
              src={imagePreview}
              alt='이미지 미리보기'
              style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
              onClick={handleImageClick}
              ref={imageRef}
            />
          </Grid2>
        )}

        <Grid2 container width={1} justifyContent={'center'}>
          <Button component='label' variant='contained' color='primary' startIcon={<CloudUpload />}>
            이미지 업로드
            <VisuallyHiddenInput
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </Button>
        </Grid2>

        {
          choiceOptions.map((choiceOption, index) => (
            <Grid2 container spacing={2} key={index} width={'100%'}>
              <Divider orientation="horizontal" flexItem style={{ height: '1px', width: '100%' }} />

              <TextField
                label={`순서`}
                variant='outlined'
                fullWidth
                value={choiceOption.orderNum}
                type='number'
                onChange={(e) => {
                  const newChoiceOptions = [...choiceOptions];
                  newChoiceOptions[index].orderNum = parseInt(e.target.value) || 0;
                  setChoiceOptions(newChoiceOptions);
                }}
              />

              <Autocomplete
                disablePortal
                options={pages}
                fullWidth
                renderInput={(params) => <TextField {...params} label="다음 페이지" />}
                value={pages.find((page) => page.id === choiceOption.nextPageId)}
                onChange={(_, value) => {
                  const newChoiceOptions = [...choiceOptions];
                  newChoiceOptions[index].nextPageId = value?.id || 0;
                  setChoiceOptions(newChoiceOptions);
                }}
              />

              <TextField
                label='내용'
                variant='outlined'
                fullWidth
                multiline
                rows={3}
                value={choiceOption.content}
                onChange={(e) => {
                  const newChoiceOptions = [...choiceOptions];
                  newChoiceOptions[index].content = e.target.value;
                  setChoiceOptions(newChoiceOptions);
                }}
                inputProps={{
                  maxLength: 100,
                }}
                required
              />

              <Button
                variant='contained'
                color='secondary'
                startIcon={<Remove />}
                onClick={() => {
                  const newChoiceOptions = [...choiceOptions];
                  newChoiceOptions.splice(index, 1);
                  setChoiceOptions(newChoiceOptions);
                }}
              >
                선택지 삭제
              </Button>
            </Grid2>
          ))
        }

        <Button
          variant='contained'
          color='primary'
          fullWidth
          startIcon={<Add />}
          onClick={() => {
            setChoiceOptions([
              ...choiceOptions,
              {
                nextPageId: 1, content: '', orderNum: choiceOptions.length + 1
              }
            ]);
          }}
        >
          선택지 추가
        </Button>

        <Button type='submit' variant='contained' color='primary' fullWidth>
          저장
        </Button>
      </Grid2>

      <Grid2
        sx={{ border: '1px solid #ddd', borderRadius: 2 }}
        size={6}
        height={'fit-content'}
        padding={2}
        width={'100%'}
        gridRow={isShowWide ? 1 : 'auto'}
        >
        <Typography variant='h5' gutterBottom>
          미리보기
          <Button variant='contained' color='primary' size='small' onClick={() => setIsShowWide(!isShowWide)}>
            {isShowWide ? '좁게' : '넓게'}
          </Button>
        </Typography>
        <Box
          display={'grid'}
          gridTemplateRows={hasImage ? 'auto auto 1fr auto' : 'auto 1fr auto'}
          width={'100%'}
          height={'auto'}
          border={'1px solid #ddd'}
          borderRadius={1}
          boxSizing={'border-box'}
          bgcolor={'#f5f5f5'}
          padding={2}
          sx={{
            aspectRatio: '16 / 9',
          }}
        >
          {title && (
            <Typography variant='h1' fontSize={36} textAlign={'center'} gutterBottom>
              {`<${title}>`}
            </Typography>
          )}
          {additionalContent.img && (
            <img
              style={{ width: '100%', aspectRatio: '5 / 1', objectFit: 'cover', objectPosition: 'top' }}
              src={additionalContent.img}
            />
          )}
          <Typography variant='body1' fontSize={28} gutterBottom whiteSpace={'pre-wrap'} dangerouslySetInnerHTML={{ __html: content }} />
          {/* 선택지 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {choiceOptions.map((choiceOption, index) => (
              <Button variant='contained' fullWidth color='secondary'>
                {choiceOption.content}
              </Button>
            ))}
          </Box>
        </Box>
      </Grid2>

      <Grid2 gridColumn={isShowWide ? 1 : 2} gridRow={isShowWide ? 3 : 2} justifyContent={'flex-end'} display={'flex'}>
        <Button variant='contained' color='error' onClick={handleDelete}>
          삭제
        </Button>
      </Grid2>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setError('')}
      >
        <Alert severity='error' onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setSuccess('')}
      >
        <Alert severity='success' onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Grid2>
  );
};
