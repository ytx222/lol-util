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
	return allGameRecord;

	// /lol-match-history/v3/matchlist/account/4005857266?begIndex=1&endIndex=20
	// /4005857266?begIndex=1&endIndex=20
}

/** 获取战绩,通过puuid */
export async function getGameRecordListFromPuuid(puuid: number, begIndex = 0, endIndex = begIndex + 1) {
	return await request({
		path: '/lol-match-history/v1/products/lol/' + puuid + '/matches',
		method: 'GET',
		parms: { begIndex, endIndex },
	});
	// /lol-match-history/v3/matchlist/account/4005857266?begIndex=1&endIndex=20
	// /4005857266?begIndex=1&endIndex=20
}

export async function getAllGameRecordFromPuuid(id: number) {
	// FIXME: 数据标注
	let allGameRecord: any[] = [];
	var i = 0;
	// 错误n次以内可以重试
	let errCount = 5;
	while (true) {
		let data;
		try {
			let res = await getGameRecordListFromPuuid(id, i, i + 200);
			data = res.data;
		} catch (error) {
			errCount--;
			if (errCount <= 0) throw error;
			continue;
		}
		if (data?.games?.gameCount) {
			console.log(`成功获取 ${i} ~ ${i + 200}的记录`);
			allGameRecord.push(...data.games.games);
			i += 200;
		} else {
			console.log(`第${i}条之后的数据获取失败,结束获取`);
			break;
		}
	}

	return allGameRecord;
}

export async function getNowHeroWinRate() {
	return await request({
		path: 'https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js',
		method: 'GET',
	});
}
