import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "../routes/BaseRoutes";
import ItemList from "../model/list_model";
import * as template from "../../common/template";
import * as Iresponse from "../../common/types/Iresponse";

export class Index extends BaseRoute {
	constructor() {
		super();
	}

	public renderView(req: Request, res: Response, next: NextFunction) {
		let title = "HAPPY 북마크";

		// 외부 모델에서 데이터르 가져옴
		let listArr = new ItemList().getList();

		// 공통 API에서 템플릿을 생성항
		let listHTML: string = template.getItemTemplate(listArr);

		// 템플릿 렌더링 시 필요한 데이터 저장함
		let options: Object = {
			title: title,
			listHTML: listHTML,
		};
		this.render(req, res, "index", options);
		// 서버에서 렌더링 수행, 서버에서 렌더링 해 출력할 템플릿으로 index 템플릿 설정
		// index 템플릿 => ejs 템플릿의 파일명
	}

	public add(req: Request, res: Response, next: NextFunction) {
		let item = req.body.item; // 클라이언트에게 받은 북마크 정보

		let response: Iresponse.IresponseItem = { success: true, item: item };
		res.send(response);
	}
}
