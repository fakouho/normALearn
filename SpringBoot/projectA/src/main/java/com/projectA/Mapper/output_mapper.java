package com.projectA.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.projectA.VO.Al_outputVO;
import com.projectA.VO.Al_userVO;

@Mapper
public interface output_mapper {

	public List<Al_outputVO> getListOutput(Al_outputVO data);
	
	public void updateProductName(Al_outputVO outputInfo);

}
