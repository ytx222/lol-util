import Axios from 'axios';
import http from 'http';
import https from 'https';
import { baseUrl } from './config';
import { RequestArgs } from './types/types';
import { relativeFilePath, toQueryString } from './util';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// 创建忽略 SSL 的 axios 实例
const axios = Axios.create({
	httpsAgent: new https.Agent({
		rejectUnauthorized: false,
	}),
});

export default request;

/**
 * @param {RequestArgs} opts
 * @returns
 */
export async function request(opts: RequestArgs) {
	const url = `${baseUrl}${opts.path}${toQueryString(opts.parms)}`;
	console.log(url);
	try {
		return await axios.request({
			url: url,
			method: opts.method ?? 'POST',
		});
	} catch (error) {
		// 一直往控制台打印一下子太长了,这里不打印到控制台了,直接输出到文件
		fs.writeFileSync(relativeFilePath('./../err.log.json'), JSON.stringify(error));
		let err = new Error();
		err.message = '出错了,错误信息已经保存到/err.log\n原错误message====\n' + error;
		throw err;
	}
}

/**
 * @param {RequestArgs} opts
 * @returns
 */
export function requestOld(opts: RequestArgs) {
	// http.request();

	return new Promise((resolve, reject) => {
		const url = `${baseUrl}${opts.path}${toQueryString(opts.parms)}`;

		console.log(url);
		const req = https.request(
			url,
			{
				method: opts.method ?? 'POST',
				headers: {
					// 'Content-Type': 'application/json',
					// 'Content-Length': Buffer.byteLength(postData),
				},
				insecureHTTPParser: true,
			},
			res => {
				// console.log(res);
				res.on('data', chunk => {
					// console.log(`BODY: ${chunk}`);
					try {
						const resData = JSON.parse(chunk);
						resolve(resData);
					} catch (err) {
						reject(chunk);
					}
				});
				res.on('error', reject);
			}
		);

		req.end(opts.data);
		// req.on('response', info => {
		// 	console.log(`Got information prior to main response: ${info.statusCode}`);

		// 	console.log();
		// });
	});
}
