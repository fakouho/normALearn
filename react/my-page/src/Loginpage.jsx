import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import $ from 'jquery';
import './Loginpage.css';
import useScript from './hooks/useScript';

// jQuery를 전역 객체에 추가
window.$ = window.jQuery = $;

const Loginpage = () => {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [cookies, setCookie] = useCookies(['userId']);
  const navigate = useNavigate();
  const siteLandingRef = useRef(null);
  const scriptStatus = useScript('/polygonizr.min.js'); // Ensure the path is correct

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/NomAlearn/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, userPw }),
        credentials: 'include',
      });

      const result = await response.json();
      
      if (response.ok && result.message === "로그인 성공") {    
        // 쿠키에 userId 설정        
        const time = 3600; //1시간
        const expiration = new Date(Date.now() + time * 1000);
        setCookie('userId', result['userId'], { path: '/' , expires: expiration});
        
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userInfo', JSON.stringify({
          userId,
          companyName: result.companyName
        }));
        
        navigate('/App');
      } else {
        alert(result.message || '로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:');
      console.log(cookies)
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleLogin();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, );  // userId와 userPw가 변경될 때마다 재구성됩니다

  useEffect(() => {
    if (scriptStatus !== 'ready') return;

    const $siteLanding = $(siteLandingRef.current);

    if (typeof $siteLanding.polygonizr === 'function') {
      $siteLanding.polygonizr();

      const handleResize = () => {
        $siteLanding.polygonizr("stop");
        $siteLanding.polygonizr({
          canvasHeight: window.innerHeight,
          canvasWidth: window.innerWidth,
        });
        $siteLanding.polygonizr("refresh");
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        $siteLanding.polygonizr("stop");
      };
    } else {
      console.error('polygonizr is not available as a jQuery function.');
    }
  }, [scriptStatus]);

  return (
    <div>
      <div className="login-container">
        <div className="title">
          <p>NORMALEARN</p>
        </div>
        <div className="title-message">
          <p>AI기반 알루미늄 열처리 공정 시스템</p>
        </div>
        <div className="login-box">
          <input
            className='login-form'
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            className='login-form'
            type="password"
            placeholder="비밀번호"
            value={userPw}
            onChange={(e) => setUserPw(e.target.value)}
          />
        </div>
        <div className="main-div" onClick={handleLogin}>
          <div className="center_div">
            <div className="rot"></div>
            <h1>START</h1>
          </div>
        </div>
      </div>
      <div id="site-landing" ref={siteLandingRef}></div>
    </div>
  );
};

export default Loginpage;
