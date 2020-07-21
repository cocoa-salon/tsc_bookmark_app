"use strict";
const server = require("./dist/server/server"); // 서버 코드를 가져옴
const debug = require("debug")("express:server");
const http = require("http");

// 서버 생성
const httpPort = 8080;
// Server 클래스의 정적메서드 bootstrap를 호출하여 새로운 서버 객체 생성 후 app 멤버변수에 접근
const app = server.Server.bootstrap().app;
app.set("port", httpPort);
const httpServer = http.createServer(app);
httpServer.listen(httpPort);

// 에러 핸들러 추가
httpServer.on("error", onError);

// 서버가 바인딩 될 때 호출
httpServer.on("listening", onListening);

// 에러 핸들러
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof httpPort === "string"
    ? "Pipe " + httpPort
    : "Port " + httpPort;

  // 에러가 발생하면 에러코드에 따라 에러 메시지 출력
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// 서버가 바인딩될 때 호출
function onListening() {
  const addr = httpServer.address();
  const bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
  console.info("Listening on " + bind);
}