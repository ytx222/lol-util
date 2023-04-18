export interface GameData {
	/**
	 * 游戏时间-时间戳
	 */
	timestamp: number;
	/** 游戏时间 */
	date: string;
	/** 游戏时长 */
	gameTime: string;
	/** 游戏时长 */
	gameTimeNumber: number;
	/** 英雄名 */
	heroName: string;

	/** 伤害 */
	damage: number;
	/** 抗伤害 */
	injured: number;
	/** 缓和伤害 */
	mitigate: number;
	/** 打钱 */
	money: number;
	/** 死亡次数 */
	deaths: number;
	/** 助攻 */
	assists: number;
	/** 击杀 */
	kills: number;
	/** 补刀 */
	killsDogface: number;
	/** 控制得分 */
	controlScore: number;
	/** 防御塔伤害 */
	towerDamage: number;

	/** 附加数据,人头伤害比 */
	kills_damage_ratio?: number | '';
}

export type GameDataKey = keyof GameData;


export interface RequestArgs {
	path: string;
	method?: 'GET' | 'POST';
	parms?: any;
	data?: any;
}
