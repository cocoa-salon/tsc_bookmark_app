import Item from "./item";
// 서버에서 HTTP 요청을 받을 때, 클라이언트에서 응답을 받아 처리할 때 사용할 인터페이스
interface IresponseItem {
	success: boolean;
	item: Item;
}

export { IresponseItem };
