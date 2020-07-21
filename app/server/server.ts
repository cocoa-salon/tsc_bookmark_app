import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
import { AppRoutes } from "./routes/appRoutes";

export class Server {
	public app: express.Application;

	public static bootstrap(): Server {
		return new Server();
	}

	constructor() {
		this.app = express();
		this.config();
		this.routes();
	}

	public config() {
		// 서버에서 사용할 정적 파일의 루트 디렉토리
		this.app.use(express.static(path.join(__dirname, "../client")));
		// 서버에서 사용할 템플릿 파일의 루트 디렉토리
		this.app.set("views", path.join(__dirname, "../server/views"));
		// 서버에서 사용할 템플릿 엔진
		this.app.set("view engine", "ejs");
		this.app.use(logger("dev"));
		this.app.use(bodyParser.json());
		this.app.use(
			bodyParser.urlencoded({
				extended: true,
			})
		);
		this.app.use(cookieParser("HELLO_TYPESCRIPT"));
		this.app.use(methodOverride());

		this.app.use(function (
			err: any,
			req: express.Request,
			res: express.Response,
			next: express.NextFunction
		) {
			err.status = 404;
			next(err);
		});
		this.app.use(errorHandler());
	}

	private routes() {
		let router: express.Router;
		router = express.Router();
		AppRoutes.create(router);
		this.app.use(router);
	}
}
