import request from './request';

export async function getUserInfo(name: string) {
	//
	// ?name=咸鱼养殖塘

	return await request({
		path: '/lol-summoner/v1/summoners',
		parms: { name },
		method: 'GET',
	});
}

export async function getGameRecordList(id: number, begIndex = 0, endIndex = begIndex + 1) {
	return await request({
		path: '/lol-match-history/v3/matchlist/account/' + id,
		method: 'GET',
		parms: { begIndex, endIndex },
	});
	// /lol-match-history/v3/matchlist/account/4005857266?begIndex=1&endIndex=20
	// /4005857266?begIndex=1&endIndex=20
}

export async function getAllGameRecord(id: number) {
	const { data: gameRecord } = await getGameRecordList(id, 1, 20);

	// console.log(gameRecord);
	const max = gameRecord.games.gameCount;
	// FIXME: 数据标注
	let allGameRecord: any[] = [];
	for (var i = 0; i < max; i += 20) {
		let { data } = await getGameRecordList(id, i, i + 20);
		console.log(`成功获取 ${i} ~ ${i + 20}的记录`);
		allGameRecord.push(...data.games.games);
	}
	return allGameRecord

	// /lol-match-history/v3/matchlist/account/4005857266?begIndex=1&endIndex=20
	// /4005857266?begIndex=1&endIndex=20
}

export async function getNowHeroWinRate() {
	return await request({
		path: 'https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js',
		method: 'GET',
	});
}
