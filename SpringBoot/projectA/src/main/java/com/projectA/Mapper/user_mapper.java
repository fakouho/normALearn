package com.projectA.Mapper;

import org.apache.ibatis.annotations.Mapper;

import com.projectA.VO.Al_userVO;

@Mapper
public interface user_mapper {
	// 로그인
	public Al_userVO login(Al_userVO data);
	// 비밀번호 변경
	public int ChangePw(Al_userVO data);

}
