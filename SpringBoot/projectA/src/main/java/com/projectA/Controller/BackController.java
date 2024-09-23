package com.projectA.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectA.Mapper.board_mapper;
import com.projectA.Mapper.input_mapper;
import com.projectA.Mapper.output_mapper;
import com.projectA.Mapper.result_mapper;
import com.projectA.Mapper.user_mapper;
import com.projectA.VO.Al_boardVO;
import com.projectA.VO.Al_inputVO;
import com.projectA.VO.Al_outputVO;
import com.projectA.VO.Al_resultVO;
import com.projectA.VO.Al_userVO;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/NomAlearn")
public class BackController {

	@Autowired
	private input_mapper input;
	@Autowired
	private output_mapper output;
	@Autowired
	private result_mapper result;
	@Autowired
	private user_mapper user;
	@Autowired
	private board_mapper board;

	@PostMapping("/getListResult") // 처음 리스트 불러오는 메소드 <- 좌측 리스트 work 필드에 값이 없을시 아이디를 통해 전체 불러오는 메소드 작동
	public ResponseEntity<List<Al_resultVO>> getListResult(@RequestBody Al_resultVO ResultInfo) {
		String work = "";
		try {
			if (ResultInfo.getWork() != null) {
				work = ResultInfo.getWork();
			}
		} catch (Exception e) {
			System.out.println("Front에서 무슨작업을 하는지 같이 보내야합니다.");
		}
		if (work.equals("myPage")) { // 프론트에서 work 파라미터에 myPage 라고 보내면 유저아이디에 맞는 자료 마이페이지 리스트만 불러온다.
			List<Al_resultVO> data = result.getMypageList(ResultInfo);
			return ResponseEntity.ok(data);
		} else {
			List<Al_resultVO> data = result.getResultList(ResultInfo);
			return ResponseEntity.ok(data);
		}

	}

	@PostMapping("/sendListResult") // 리스트 변경사항 있을 떄 작동하는 메소드 (반환할게 없을때 사용)
	public void sendListResult(@RequestBody Al_resultVO ResultInfo) {
		String work = ResultInfo.getWork();
		if (work.equals("ChangeNumber")) {
			result.changeResultNumber(ResultInfo);
		} else if (work.equals("ChangeCheckBox")) {
			result.changeResultCheckBox(ResultInfo);
		} else if (work.equals("ChangeMypage")) {
			result.mypageCheck(ResultInfo);
		} else {
			System.out.println("오류");
		}
	}

	@GetMapping("/getListOutput") // 전체 출력값 가져오기 현재 차트에 사용중.
	public ResponseEntity<List<Al_outputVO>> getListOutput(Al_outputVO data) {
		List<Al_outputVO> list = output.getListOutput(data);
		return ResponseEntity.ok(list);
	}

	@PostMapping("/sendListOutput") //
	public void sendListOutput(@RequestBody Al_outputVO OutputInfo) {
		String work = "없음";
		try {
			work = OutputInfo.getWork();
		} catch (Exception e) {
		}
		if (work.equals("updateProductName")) {
			output.updateProductName(OutputInfo);
		}

	}

	@PostMapping("/sendSearchData") // 조성을 입력해 검색하는 기능
	public ResponseEntity<List<Al_outputVO>> sendSearchData(@RequestBody Al_inputVO inputData) {
		List<Al_outputVO> SearchResult = input.insertInputAndUseIdxSearchOutput(inputData);
		System.out.println(SearchResult.get(0).getInputIdx());
		return ResponseEntity.ok(SearchResult);
	}

	@PostMapping("/clickListData") // 좌측 검색기록 클릭시 데이터 전송 -> 차트에 바로 표시됨
	public ResponseEntity<List<Al_outputVO>> clickListData(@RequestBody Al_resultVO data) {
		System.out.println(data.getOutputIdx());
		System.out.println(data.getUserId());
		List<Al_outputVO> ClickData = result.ClickListSerch(data);
		try {
			System.out.println(ClickData.get(0));
		} catch (Exception e) {
			System.out.println("DataMissing");
		}
		return ResponseEntity.ok(ClickData);
	}

	@PostMapping("/ChangePw") // 비밀번호 변경 userId, userPw, newPw 보내면됨
	public ResponseEntity<Map<String, Object>> ChangePw(@RequestBody Al_userVO data) {
		Map<String, Object> responseBody = new HashMap<>();
		int row = user.ChangePw(data);
		if (row == 1) {
			responseBody.put("message", "ok");
			return ResponseEntity.ok(responseBody);
		} else {
			responseBody.put("message", "fail");
			return ResponseEntity.ok(responseBody);
		}
	}

	@PostMapping("/board")
	public ResponseEntity<List<Al_boardVO>> board(@RequestBody Al_boardVO data) {
		String work = "없음";
		try {
			work = data.getWork();
		} catch (Exception e) {
		}
		if (work.equals("write")) {
			board.writeBoard(data);
		} else if (work.equals("edit")) {
			board.editBoard(data);
		} else if (work.equals("Status")) {
			board.editProgress(data);
		} else if (work.equals("delete")) {
			board.deleteBoard(data);
		} else {
			if (data.getUserId().equals("admin")) { // 만약 로그인한 계정이 "admin" 이라면 아이디 상관없이 전부 가져옴
				List<Al_boardVO> responseBody = board.getAllBoardList(data);
				return ResponseEntity.ok(responseBody);
			} else {
				List<Al_boardVO> responseBody = board.getBoardList(data);
				return ResponseEntity.ok(responseBody);
			}
		}
		return null;
	}

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody Al_userVO loginData, HttpSession session,
			HttpServletResponse response) {
			Map<String, Object> responseBody = new HashMap<>();
			Al_userVO result = user.login(loginData);
			if (result != null) { 

			Al_userVO user = new Al_userVO();
			user.setCompanyName(result.getCompanyName());
			user.setUserId(result.getUserId());
			session.setAttribute("userId", user);

			Cookie cookie = new Cookie("Alsession", session.getId());
			cookie.setHttpOnly(true);
			cookie.setPath("/");
			cookie.setMaxAge(30);
			response.addCookie(cookie);

			responseBody.put("message", "로그인 성공");
			responseBody.put("userId", user.getUserId());
			responseBody.put("companyName", user.getCompanyName());

			return ResponseEntity.ok(responseBody);
		} else {
			System.out.println("로그인 실패");
			responseBody.put("message", "로그인 실패");
			return ResponseEntity.ok(responseBody);
		}
	}

}