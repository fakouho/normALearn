import React, { useState } from 'react';
import Modal from 'react-modal';
import { useCookies } from 'react-cookie';

Modal.setAppElement('#root');

function Pwch({ isOpen, onRequestClose }) { // 함수 이름 수정
    const [userPw, setUserPw] = useState(''); // 기존 비번
    const [newPw, setNewPw] = useState(''); // 바꿀 비번
    const [conPw, setConPw] = useState(''); // 재확인 비번 
    const [cookie] = useCookies(['userId']); // 쿠키속 유저이름

    const handleSubmit = () => {
        const userId = cookie.userId;
        if (newPw === conPw) {
            fetch("http://localhost:8080/NomAlearn/ChangePw", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'userId': userId, 'userPw': userPw, 'newPw': newPw })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.message === 'ok') {
                        alert('비밀번호가 성공적으로 변경되었습니다.');
                        onRequestClose();
                    } else {
                        alert('비밀번호 변경 실패. 쿠키 삭제 후 다시 시도하세요.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('비밀번호 변경 중 오류가 발생했습니다.');
                });
        } else {
            alert('새 비밀번호가 일치하지 않습니다.');
        }
    };


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            <h2>비밀번호 변경</h2>
            <input
                type="password"
                placeholder="현재 비밀번호"
                value={userPw}
                onChange={(e) => setUserPw(e.target.value)}
            />
            <input
                type="password"
                placeholder="새 비밀번호"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
            />
            <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={conPw}
                onChange={(e) => setConPw(e.target.value)}
            />
            <div className="button-container">
                <button className='btn btn-primary' onClick={handleSubmit}>변경</button>
                <button className='btn btn-primary' onClick={onRequestClose}>취소</button>
            </div>

        </Modal>
    );
}

export default Pwch; // 컴포넌트 이름과 일치시키기
