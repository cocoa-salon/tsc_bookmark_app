import { Request, Response } from "express";
// URL을 처리하는 부모 클래스
export class BaseRoute {
	protected title: string;
	private scripts: string[];

	constructor() {
		this.title = "타입스크립트 기반 서버";
	}

	public addScript(src: string): BaseRoute {
		this.scripts.push(src);
		return this;
	}

	// 서버에 클라이언트에게 응답 시 렌더링 방법
	public render(req: Request, res: Response, view: string, option?: Object) {
		// 기본 URL 주소를 설정
		res.locals.BASE_URL = "/";
		// 스크립트를 추가
		res.locals.scripts = this.scripts;
		// 페이지 제목을 추가
		res.locals.title = this.title;
		// 최종적으로 렌더링을 처리하는 메서드
		res.render(view, option);
	}
}
