import { GameData, GameDataKey } from "./types/types";

export class Statistics {
	list = [];
	data = new Map<GameDataKey, { count: number; value: number }>();
	ignore: string[];
	/**
	 *
	 * @param {string[]} ignore
	 */
	constructor(ignore: GameDataKey[] = []) {
		this.ignore = ignore;
	}

	add(data: GameData) {
		this.appendData(data);

		(Object.keys(data) as GameDataKey[]).forEach(k => {
			// 如果这个key 需要忽略
			if (this.ignore.includes(k)) return;
			if (!this.data.has(k)) {
				this.data.set(k, { count: 0, value: 0 });
			}

			if (data[k] === '') {
				return;
			}
			let item = this.data.get(k)!;
			item.count++;
			item.value += data[k] as number;
		});
	}

	/**
	 *
	 */
	appendData(data: GameData) {
		// 附加人头伤害比
		if (data.kills) {
			data.kills_damage_ratio = ~~(data.damage / data.kills);
		} else {
			data.kills_damage_ratio = '';
		}
	}

	calc() {
		let list = [...this.data.entries()];
		// console.log(list);
		let obj: { [key in GameDataKey]?: number } = {};
		list.forEach(([k, v]) => {
			let t = v.value / v.count;
			if (t > 10000) {
				t = ~~t;
			} else if (t > 100) {
				t = +t.toFixed(2);
			} else {
				t = +t.toFixed(4);
			}

			obj[k] = t;
		});
		return obj;
	}
}
