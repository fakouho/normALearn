package com.projectA.VO;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Al_inputVO {
    private Long inputIdx;
    private BigDecimal tensileStrength;
    private BigDecimal yieldStrength;
    private BigDecimal hardness;
    private BigDecimal elongation;
    private char firstSolution;
    private char secondSolution;
    private char aging;
    private String userId;
}
