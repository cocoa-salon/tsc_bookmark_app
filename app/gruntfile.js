module.exports = function (grunt) {
  "use strict";
  // 웹팩을 통한 번들링 작업을 할 것이므로
  var webpack = require('webpack');
  // 단위 작업의 경과 시간을 표시하기 위해
  require('time-grunt')(grunt);

  var path = require('path');

  grunt.initConfig({
    /*
    등록한 단위 작업 정의
		클라이언트는 최적화와 관련해 번들링을 수행합니다.
    */
    webpack: {
      // 웹팩 작업명
      compile_client: {
        devtool: 'source-map',
        entry: ['./client/js'],
        output: {
          path: path.resolve(__dirname, 'dist/client/js'), filename: 'app.js'
        },

        module: {
          loaders: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }]
        },
        plugins: [
          new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
          })
        ],
        resolve: { extensions: [".ts", ".js"] }
      }
    },
    /*
		서버는 번들링을 하지 않고 컴파일만 수행합니다.
    */
    ts: {
      compile_server: {
        files: [{
          src: ["server/**/*.ts", "!server/.baseDir.ts"],
          // server 디렉토리 하위에 있는 모든 ts파일을 대상, .baseDir.ts 파일은 제외
          dest: "./dist"
          // 컴파일 결과는 dist 디렉토리
        }],
        options: {
          module: "commonjs",
          target: "es6",
          sourceMap: false,
          options: {
            callback: function (ts) {
              // 콜백 작업
            }
          }
        }
      }
    },
    copy: {
      // 특정 디렉토리에 있는 정적파일을 dist 디렉토리로 모두 복사하는 작업
      client_static: {
        /* 
          js 디렉터리만 제외하고 ./client가 포함하는 모든 파일을 복사합니다.
          expand : true이면 옵션을 확장해 cwd옵션을 사용할 수 있게 합니다.
                cwd : 작업할 소스들의 부모 디렉터리의 경로를 입력합니다.
            */

        files: [{ expand: true, cwd: "./client", src: ["**", "!**/js/**"], dest: "./dist/client" }]
      },
      server_template: {
        files: [{ expand: true, cwd: "./server/views", src: ["**"], dest: "./dist/server/views" }]
      }
    },
    concurrent: {
      // 백그라운드에서 실행되는 동시성 작업들
      dev: {
        tasks: ['nodemon', 'watch', "browserSync"],
        options: { logConcurrentOutput: true }
      }
    },
    nodemon: {
      // 코드 변경을 감지하여, 서버를 자동으로 재실행
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--inspect'], env: { PORT: '8080' }, delay: 1000, ignore: ['node_modules/**'],
          ext: 'js, ejs',
          callback: function (nodemon) {
            // 코드 변경이 일어날 때 실행되는 각종 콜백 함수
            nodemon.on('log', function (event) {
              console.log("nodemon log : " + event.colour);
            });

            nodemon.on('config:update', function () {
              require('open')('http://localhost:8080');
              // 서버가 실행되는 시점에 브라우저 열기 작업 실행
              // grunt가 실행되고 서버가 실행되는 최초 1회만 실행
            });

            nodemon.on('restart', function () {
              console.log("nodemon restart");
              setTimeout(function () {
                require('fs').writeFileSync('.rebooted', 'rebooted');
                // 서버가 재실행되고 1초 후, 그 전까지 그런트에 추가된 단위 작업이 모두 끝나야 한다.
                // 1초가 지나면, .rebooted 파일 쓰기 수행
              }, 1000);
            });
          }
        }
      }
    },
    watch: {
      // 감시 작업
      client_webpack: {
        // 클라이언트 디렉토리 코드 변경시 webpack 작업 수행
        files: ["client/js/**/*.ts"],
        // 감시 대상이 되는 파일
        tasks: ["webpack"]
      },
      client_static: {
        // 클라이언트 디렉토리 정적 파일 변경 시 복사 작업 수행
        files: ["client/**", "!client/js/**"],
        tasks: ["copy:client_static"]
      },
      /* 
         서버 코드나 공통 API(common 디렉터리)의 코드가 변경되면 
         ts 작업이 실행되도록 합니다.
      */
      server_ts: {
        // 서버 애플리케이션의 타입스크립트 코드 common api 코드에 변경이 생길 시 자동으로 컴파일 작업 수행
        files: ["server/**/*.ts", "common/**/*.ts", "!client/js/**/*.ts"],
        tasks: ["ts"]
      },
      /*  
          ejs 템플릿의 내용이 변경되면 서버 템플릿 복사 작업(copy:server-template)을
          수행합니다. 
          dist 디렉터리에 위치한 .ejs 파일은 작업 파일이 아니므로 
          변화 감지가 되지 않도록 설정합니다.
      */
      server_template: {
        files: ["**/*.ejs", "!dist/**/*.ejs"],
        tasks: ["copy:server_template"]
      }
    },
    browserSync: {
      // 그런트에서 파일 변화를 감지해 서버가 컴파일되고 재실행되는(nodemon) 시점을 기준으로
      // .rebooted 파일 변화를 감지하여, 열려있는 브라우저 업데이트 수행
      files: [".rebooted"]
    }
  });
  // 단위 작업 등록(단위작업명은 devDependencies에 추가된 패키지명을 따옴)
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-contrib-copy");

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask("default", [
    "webpack",
    "ts",    // 서버 올릴 때 컴파일 작업 수행
    "copy", // 서버 올릴 때 한번만 복사 작업 수행
    "concurrent"
  ]);
};