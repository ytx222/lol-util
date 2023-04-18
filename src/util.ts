/**
 * 用于动态设置key的
 */
type queryObj = Record<string, any>;

/**
 * 转换为查询字符串形式
 *
 * 这个方法现在会忽略undefined
 * @param {*} data
 */
export function toQueryString(data: queryObj) {
	if (data === undefined || data === null) return '';
	if (typeof data === 'string') return data;
	let str = '';
	// 简单的值就直接遍历,复杂的值函数处理
	for (const i in data) {
		// null也传null
		const _data = data[i]; // == undefined ? '' : data[i];
		if (_data === undefined) continue;

		if (typeof _data === 'object') {
			parseObj(_data, i);
		} else {
			str += `&${i}=${_data}`;
		}
	}
	/** 遍历二级对象 */
	function parseObj(o: Record<string | number, any>, lastKey?: string) {
		const type = toTypeString(o);
		let keys: string[] | number[];
		if (type === 'object') {
			keys = Object.keys(o);
		} else if (type === 'array') {
			keys = Array(o.length)
				.fill(void 0)
				.map((_, i) => i);
		}
		// 逻辑上之前肯定已经被赋值了,但是这里还是加一下
		else keys = [];
		// console.log(keys, o, lastKey);
		keys.forEach(k => {
			// 忽略值为undefined的字段
			if (o[k] === undefined) return;
			const _data = o[k];
			// let _data = o[k] === undefined ? '' : o[k];
			if (typeof _data === 'object') {
				parseObj(_data, `${lastKey}[${k}]`);
			} else {
				str += `&${lastKey}[${k}]=${_data}`;
			}
		});
	}
	// console.warn(str);
	let res = str.substring(1);
	if (res) {
		return '?' + res;
	}
	return '';
}

/**
 * 获取值的类型
 * @param {any} v
 */
export function toTypeString(v: any) {
	let s = Object.prototype.toString.call(v);
	s = s.substring(8, s.length - 1);
	return s.toLowerCase();
}

/**
 *
 * 将时间转换为 字符串
 * @desc: 格式化时间
 * @return: eg: '09/04/2018 21:31:00'
 */
export function formatTime(date: Date | '--') {
	// 错误的时间拦截
	if (Object.is(+date, NaN) || date === '--') {
		// return 'Waktu tidak diketahui';
		return '--';
	}
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

/**
 * 将日期转换为 字符串
 * @desc: 格式化日期
 * @return: eg: '09/04/2018 21:31:00'
 * @param {Date对象} date
 */
export function formatDate(date: Date | '--') {
	// 错误的时间拦截
	if (date === new Date(NaN) || date === '--') {
		return 'Waktu tidak diketahui';
	}
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return [year, month, day].map(formatNumber).join('/');
} // 字符串转日期格式，strDate要转为日期格式的字符串

/**
 * @desc: 格式化数字
 * @return: n > 10 [eg: 12] => 12 | n < 10 [eg: 3] => '03'
 */
export function formatNumber(v: number) {
	const num = v.toString();
	return num[1] ? num : '0' + num;
}
