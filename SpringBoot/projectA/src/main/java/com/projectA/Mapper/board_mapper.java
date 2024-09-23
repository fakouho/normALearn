package com.projectA.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.projectA.VO.Al_boardVO;

@Mapper
public interface board_mapper {

	void writeBoard(Al_boardVO data);

	void editBoard(Al_boardVO data);

	void editProgress(Al_boardVO data);

	void deleteBoard(Al_boardVO data);

	List<Al_boardVO> getAllBoardList(Al_boardVO data);

	List<Al_boardVO> getBoardList(Al_boardVO data);
	
	

}
