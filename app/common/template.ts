import Item from "./types/item";
// HTML 생성 모듈, 서버와 클라이언트에서 렌더링할 때 필요한 HTML 코드를 생성
// 데이터를 받아 HTML 템플릿에 적용
export function getItemTemplate(arr: Item[]): string {
	let html = [];
	for (let i = 0; i < arr.length; i++) {
		html.push(`
      <div class="col-xs-4 max50">
          <h2>${arr[i].title}</h2>
          <p>${arr[i].intro}</p>
          <p><a href="${arr[i].url}" target="_blank " class="btn btn-link">바로가기 &raquo;</a></p>
      </div>`);
	}
	return html.join("");
}
