package com.projectA.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Al_userVO {
    private String userId;
    private String userPw;
    private String apiKey;
    private String companyName;
    // DB에 없는 자료
    private String newPw;
}