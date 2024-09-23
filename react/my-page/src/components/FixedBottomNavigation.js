import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Pagination from '@mui/material/Pagination';
import { Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

const theme = createTheme({
  typography: {
    fontFamily: 'Pretendard, Arial, sans-serif', // 전체 애플리케이션에서 사용할 글꼴 설정입니다.
  },
});

// 주 컴포넌트인 FixedBottomNavigation을 정의합니다. refreshList prop을 받아옵니다.
export default function FixedBottomNavigation({ refreshList }) {
  const [page, setPage] = useState(1); // 현재 페이지 번호를 상태로 관리합니다.
  const [messages, setMessages] = useState([]); // 메시지 데이터를 상태로 관리합니다.
  const itemsPerPage = 6; // 페이지당 표시할 항목 수입니다.

  // 데이터를 서버로부터 가져오는 비동기 함수입니다.
  const fetchData = async () => {
    try {
      const data = {
        userId: 'admin', // 요청에 사용할 사용자 ID입니다.
        work: '' // 요청의 작업 유형입니다.
      };
      const response = await fetch('http://localhost:8080/NomAlearn/board', {
        method: 'POST', // HTTP POST 메서드를 사용합니다.
        headers: {
          'Content-Type': 'application/json', // 요청의 콘텐츠 유형을 JSON으로 설정합니다.
        },
        body: JSON.stringify(data) // JSON 형식으로 데이터를 문자열로 변환하여 요청 본문에 포함합니다.
      });
      if (response.ok) {
        const data = await response.json(); // 응답이 성공적이면 JSON 형식으로 응답 데이터를 가져옵니다.
        console.log('게시판 데이터:', data); // 데이터를 콘솔에 출력하여 확인
        setMessages(data); // 가져온 데이터를 messages 상태에 저장합니다.
      } else {
        console.error('데이터를 가져오는 데 실패했습니다.'); // 응답이 실패했을 때 오류 메시지를 콘솔에 출력합니다.
      }
    } catch (error) {
      console.error('데이터 가져오기 중 오류 발생:', error); // 요청 중 오류가 발생했을 때 오류 메시지를 콘솔에 출력합니다.
    }
  };

  // 컴포넌트가 처음 마운트될 때 데이터를 가져옵니다.
  useEffect(() => {
    fetchData();
  }, []);

  // refreshList prop이 변경될 때마다 데이터를 새로 가져옵니다.
  useEffect(() => {
    if (refreshList) {
      fetchData();
    }
  }, [refreshList]);

  // 페이지 변경 이벤트를 처리하는 함수입니다.
  const handleChangePage = (event, newPage) => {
    setPage(newPage); // 새로운 페이지 번호를 상태에 저장합니다.
  };

  // 현재 페이지에 해당하는 메시지들을 잘라내어 배열로 만듭니다.
  const paginatedMessages = messages.length > 0 
    ? messages.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : [];

  // 컴포넌트의 UI를 렌더링합니다.
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* 기본 CSS 스타일을 초기화하여 Material-UI 스타일로 덮어씁니다. */}
      <Box sx={{ pb: 7 }}> {/* 아래쪽에 패딩을 추가하여 하단의 여백을 만듭니다. */}
        <List>
          {paginatedMessages.map((message, index) => (
            <ListItemButton key={index}> {/* 리스트 아이템을 클릭 가능한 버튼으로 만듭니다. */}
              <ListItemAvatar>
                <Avatar alt="Profile Picture" src={message.person || '/static/images/avatar/default.jpg'} /> {/* 아바타 이미지를 표시합니다. */}
              </ListItemAvatar>
              <ListItemText
                primary={message.title || 'No title'}
                secondary={`진행 상태: ${message.progress || 'No progress'} | 내용: ${message.content || 'No content'} `} // 제목, 내용과 진행 상태를 표시합니다.
              />
            </ListItemButton>
          ))}
        </List>
        {messages.length > itemsPerPage && ( // 메시지의 총 개수가 페이지당 항목 수보다 많을 경우에만 페이지 네이션을 표시합니다.
          <Container maxWidth="sm"> {/* 컨테이너의 최대 너비를 설정하여 페이지 내용을 가운데로 맞춥니다. */}
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}> {/* 페이지 네이션을 가운데 정렬합니다. */}
              <Pagination
                count={Math.ceil(messages.length / itemsPerPage)} // 전체 페이지 수를 계산하여 설정합니다.
                page={page} // 현재 페이지 번호를 설정합니다.
                onChange={handleChangePage} // 페이지 변경 이벤트를 처리하는 함수를 설정합니다.
                color="primary" // 페이지 네이션의 색상을 기본 색상으로 설정합니다.
              />
            </Box>
          </Container>
        )}
      </Box>
    </ThemeProvider>
  );
}
