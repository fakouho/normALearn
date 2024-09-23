import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';

const theme = createTheme({
  typography: {
    fontFamily: 'Pretendard, Arial, sans-serif',
  },
});

export default function FormPropsTextFields({ onDataSubmitted }) {
  const [companyName, setCompanyName] = useState('');

  const broadclick = async () => {
    const data = {
      title: '스마트인재개발원',
      content: companyName,
      userId: 'admin',
      work: 'write'
    };

    try {
      const response = await fetch('http://localhost:8080/NomAlearn/board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('전송이 완료되었습니다.');
        setCompanyName('');
        if (onDataSubmitted) {
          onDataSubmitted();
        }
      } else {
        alert('서버 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          id="filled-required"
          label="스마트인재개발원"
          variant="filled"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          InputProps={{ style: { height: '150px' } }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end', // 버튼을 오른쪽으로 정렬
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={broadclick}
          >
            제출
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
