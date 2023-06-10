import { exportTableByName, init } from '../src/index';
import { getUserInfo } from '../src/main';
import { getAllGameRecord, getAllGameRecordFromPuuid, getGameRecordListFromPuuid, getUserInfo as getUserInfoApi } from './../src/api';
await init();

// const userName = '咸鱼养殖塘';
// const userName = '池塘里咸鱼';
const userName = '征程玉寂寥';
// const userName = 'Sue春风自在';
// const userName = '师太别走';
// const userName = '飞霞540888';
// const userName = '伊人何处心无归属';
// const userName = '丨nb';

// const userName = '哦也哦也哦也';
// Sue春风自在
// 征程玉寂寥

// const user = await getUserInfoApi(userName);
// console.warn(user.data);
// const puuid = user.data.puuid;
// let list = await getGameRecordListFromPuuid(puuid,800,1000)
// console.log(list.data);
// console.log(list.data.games.games[0]);


try {

	// let list = await getAllGameRecordFromPuuid(puuid);
	// console.log(list);
	await exportTableByName(userName,'backup/');
} catch (error) {
	console.log('出错了', error);

}


// gameId: 550319070,
// exportTableByName(userName);

/**

https://riot:OOGSgLhrJ_-uM1ilFZr-fw@127.0.0.1:11934/
https://riot:OOGSgLhrJ_-uM1ilFZr-fw@127.0.0.1:11934/Help

 */
