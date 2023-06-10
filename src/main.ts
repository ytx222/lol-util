import { getAllGameRecord, getUserInfo as getUserInfoApi } from './api';
import { heros } from './datas/heros';
// @ts-ignore
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatNumber, formatTime, relativeFilePath } from './util';
import { Statistics } from './statistics';
import { GameData, GameDataKey } from './types/types';
import { Path } from 'typescript';

/**
 * 获取玩家信息
 */
export async function getUserInfo(name: string) {
	const { data: user } = await getUserInfoApi(name);
	console.log('获取玩家信息', name);
	// console.log({ user });
	return {
		summonerId: user.summonerId,
		name: user.displayName,
		puuid: user.puuid,
		level: user.summonerLevel,
	};
}

export function parseGameRecord(gameRecord: any): GameData | null {
	let date = gameRecord.gameCreationDate;
	let timestamp = +new Date(date);
	date = new Date(date).toLocaleString();
	const t = gameRecord.gameDuration;
	// 忽略重开局
	if (t < 180) return null;
	const gameTime = `${formatNumber(~~(t / 60))}:${formatNumber(t % 60)}`;

	let mode = gameRecord.gameMode;
	// // 排除非大乱斗
	if (mode !== 'ARAM') return null;
	let heroId = gameRecord.participants[0].championId;
	const heroName = heros[heroId as 1]?.name;
	const stats = gameRecord.participants[0].stats;

	// 伤害
	const damage = stats.totalDamageDealtToChampions;
	// 抗伤害
	const injured = stats.totalDamageTaken;
	// 缓和伤害
	const mitigate = stats.damageSelfMitigated;
	// 打钱
	const money = stats.goldEarned;
	// 死亡次数
	const deaths = stats.deaths;
	// 助攻
	const assists = stats.assists;
	// 击杀
	const kills = stats.kills;
	// 补刀
	const killsDogface = stats.totalMinionsKilled;
	// 控制得分
	const controlScore = stats.timeCCingOthers;
	// 防御塔伤害
	const towerDamage = stats.damageDealtToTurrets;

	return {
		// 排序用
		timestamp,
		date,
		gameTime,
		gameTimeNumber: gameRecord.gameDuration,
		heroName,

		damage,
		injured,
		mitigate,
		money,
		deaths,
		assists,
		kills,
		killsDogface,
		controlScore,
		towerDamage,
	};
}

export function dataToArray(data: GameData[]): (string | number | undefined)[][] {
	const k_names = {
		时间: 'date',
		英雄: 'heroName',
		游戏时长: 'gameTime',
		伤害: 'damage',
		抗伤害: 'injured',
		缓和伤害: 'mitigate',
		打钱: 'money',
		击杀: 'kills',
		助攻: 'assists',
		死亡: 'deaths',
		补刀: 'killsDogface',
		控制得分: 'controlScore',
		防御塔伤害: 'towerDamage',
	};
	const k = Object.values(k_names) as GameDataKey[];

	// 处理统计数据
	const statistics = new Statistics(['timestamp', 'date', 'gameTime', 'heroName']);
	data.map(e => statistics.add(e));

	// 数据源 二维数组,
	const arr = [
		Object.keys(k_names),
		[],
		[],
		...data.map(e => {
			return k.map(key => e[key]);
		}),
	];

	const statisticsData = statistics.calc();
	arr[1] = k.map(key => statisticsData[key]);
	const gameTime = ~~statisticsData.gameTimeNumber!;
	arr[1][0] = '平均值';

	arr[1][2] = `${~~formatNumber(gameTime / 60)}:${formatNumber(gameTime % 60)}`;
	return arr;
}

// data 转换成excel
export function exportTable(arr: any[][], userName: string, toPath?: string) {
	const workbook = XLSX.utils.book_new();
	// console.log(arr);
	const worksheet = XLSX.utils.aoa_to_sheet(arr);
	// // 设置宽度
	worksheet['!cols'] = [{ wch: 20 }, { wch: 9 }, { wch: 10 }];
	// 将工作表添加进工作铺
	XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');

	// const range = XLSX.utils.decode_range('F2:H4');
	// worksheet['!merges'] = [range];
	// console.log({ workbook, range });
	// @ts-ignore
	const time = formatTime(new Date()).replaceAll('/', '.').replaceAll(':', '.').replaceAll(' ', '_');
	const name = `${time}_${userName}_战绩导出.xlsx`;
	// XLSX.writeFile(workbook, name, { compression: true });
	const bin = XLSX.write(workbook, { type: 'binary', compression: true });

	toPath ??= relativeFilePath('../result/');
	// console.log({ toPath });
	const _toFile = path.resolve(toPath, name);
	// console.log(_toFile);
	fs.writeFileSync(_toFile, bin, { encoding: 'binary' });
}
