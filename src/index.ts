import { getAllGameRecord, getAllGameRecordFromPuuid } from './api';
import { updateBaseUrl } from './config';
import { getToken } from './lcu/getLCUToken';
import { getLoLPath } from './lcu/getLolRegeditInfo';
import { parseGameRecord, getUserInfo, dataToArray, exportTable } from './main';

console.log('开始执行lol-util');
// 获取token

export async function init() {
	let t = await getToken();
	if (t) {
		updateBaseUrl(`https:\/\/riot:${t.token}@127.0.0.1:${t.port}`);
	} else {
		throw t;
	}
	console.log(t);
}

// exportTableByName(userName)

export async function exportTableByName(name: string, savePath?: string) {
	const user = await getUserInfo(name);
	// console.log(user);
	// const allGameRecord = await getAllGameRecord(user.summonerId);
	const allGameRecord = await getAllGameRecordFromPuuid(user.puuid);
	// console.warn({allGameRecord});

	const max = allGameRecord.length;
	let allGameData = allGameRecord.map(parseGameRecord);
	// 去除被忽略的项目
	// @ts-ignore
	let list = allGameData.filter<GameData>(e => e !== null);
	console.log(`共获取${max}个记录,排除被忽略的项目后剩余${list.length}个`);
	// 数据顺序不知道为啥有点乱,排下序
	list.sort((a, b) => b.timestamp - a.timestamp);
	const arr = dataToArray(list);
	exportTable(arr, name, savePath);
}
