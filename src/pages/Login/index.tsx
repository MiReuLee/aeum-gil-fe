import { Grid2, TextField } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import ButtonUsage from '../../components/Button';
import Logo from '../../components/Logo';
import MainBg from '../../components/MainBg';
import { login } from '../../utils/api';

export const Login = () => {
  const dispatch = useDispatch();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ id: '', password: '' });

  const validateForm = () => {
    const newErrors = { id: '', password: '' };

    if (!id.trim()) {
      newErrors.id = '아이디를 입력해주세요.';
    }

    if (!password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);

    // 에러가 없으면 true 반환
    return !newErrors.id && !newErrors.password;
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const token = await login(id, password);

      localStorage.token = token;

      dispatch({ type: 'auth/login', payload: token });
    } catch (e) {
      console.error('로그인 실패:', e);
      setErrors({ ...errors, id: '아이디 또는 비밀번호가 잘못되었습니다.', password: '' });
    }
  };

  return (
    <>
      <MainBg gap={'10rem'}>
        <Logo />

        <Grid2
          container component="form" direction={'column'} alignItems={'center'} justifyContent={'center'} gap={'1rem'}
          onSubmit={handleSubmit}
        >
          <span style={{ fontSize: '1.75rem' }}>
            로그인
          </span>

          <TextField
            label="아이디"
            variant="standard"
            slotProps={{
              input: {
                disableUnderline: true,
              },
            }}
            sx={{ width: 'min(24.75rem, 80vw)', paddingBottom: '0.5rem' }}
            onChange={(e) => setId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            className="login-id"
            error={!!errors.id} // 에러가 있으면 true
            helperText={errors.id} // 에러 메시지 표시
            required
          />

          <TextField
            label="비밀번호"
            type="password"
            variant="standard"
            slotProps={{
              input: {
                disableUnderline: true,
              },
            }}
            sx={{ width: 'min(24.75rem, 80vw)', paddingBottom: '0.5rem' }}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            className="login-id"
            error={!!errors.password} // 에러가 있으면 true
            helperText={errors.password} // 에러 메시지 표시
            required
          />

          <ButtonUsage type="submit">
            <span>
              제출
            </span>
          </ButtonUsage>
        </Grid2>
      </MainBg>
    </>
  );
};
