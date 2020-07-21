import * as $ from "jquery";
import Item from "../../common/types/item";
import * as template from "../../common/template";
import * as validator from "../../common/validator";
import * as Iresponse from "../../common/types/Iresponse";

namespace Main.IndexPage {
	$(function () {
		$("#form").hide();
		// 북마크 등록 버튼 클릭시 등록 창 토글
		$("#openForm").on("click", function () {
			if ($("#form").is(":visible")) {
				// 등록 창이 표시 상태면 북마크 목록 표시
				$("#item-list").show();
				// 등록 창 숨김
				$("#form").hide();
			} else {
				$("#item-list").hide();
				$("#form").show();
				$("#siteTitle").focus();
				// 제목 입력 상자에 포커스
			}
		});
		// 북마크 정보 입력 후 저장 버튼 클릭 시
		$("#btnSave").on("click", function () {
			if (validator.isURL($("#siteURL").val())) {
				// URL이 유효하다면
				let siteTitle = $("#siteTitle").val();
				let siteIntro = $("#siteIntro").val();
				let siteURL = $("#siteURL").val();
				let inputItem: Item = {
					title: siteTitle,
					intro: siteIntro,
					url: siteURL,
				};
				// 비동기 HTTP 요청
				$.post(
					"/add",
					{ item: inputItem },
					function (data: Iresponse.IresponseItem) {
						let arr: Item[] = [];
						arr.push(data.item);
						let itemHTML: string = template.getItemTemplate(arr);
						$(".col-xs-4:last").after(itemHTML);
						$("#item-list").show();
						$("#form").hide();
					},
					"json"
				);
			} else {
				// URL이 유효하지 않다면
				alert("유효한 URL이 아닙니다.");
			}
		});
	});
}
