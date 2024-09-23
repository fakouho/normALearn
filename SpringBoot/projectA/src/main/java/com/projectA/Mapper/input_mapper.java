package com.projectA.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.projectA.VO.Al_inputVO;
import com.projectA.VO.Al_outputVO;

@Mapper
public interface input_mapper {

	public List<Al_outputVO> insertInputAndUseIdxSearchOutput(Al_inputVO inputData);

}
