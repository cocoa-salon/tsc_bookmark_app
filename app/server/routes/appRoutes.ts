import { NextFunction, Request, Response, Router } from "express";
// 렌더링 메서드를 별도로 모아 클래스로 정의
import { BaseRoute } from "./../routes/BaseRoutes";
import { Index } from "../controllers/index";

export class AppRoutes extends BaseRoute {
	constructor() {
		super();
	}

	public static create(router: Router) {
		router.get("/", (req: Request, res: Response, next: NextFunction) => {
			new Index().renderView(req, res, next);
		});

		router.post("/add", (req: Request, res: Response, next: NextFunction) => {
			new Index().add(req, res, next);
		});
	}
}
