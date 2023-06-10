/**
 * 由于国服搞得客户端也不让查的
 * 所以直接读取日志查询
 */
import fs from 'fs';
import path from 'path';
import { getLoLPath } from './getLolRegeditInfo';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
async function getLogPath() {
	let _path = await getLoLPath();
	//
	// console.log(_path);
	return path.join(_path, '\\LeagueClient');
}

// 2023-02-19T17-46-47_24432_LeagueClientUx.log
const logRegex = /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_\d+_LeagueClientUx\.log/;
/**
 *  Command line arguments: ...
 *  Creating ux window with url
 */
const tokenRegex = /Creating ux window with url https:\/\/riot:([\w-]+)@127.0.0.1:(\d+)\/bootstrap\.html\./;

export async function getToken() {
	const logPath = await getLogPath();
	// console.log({ logPath });
	let files = fs.readdirSync(logPath);
	files = files.filter(e => logRegex.test(e));
	// 排序后的第一个就是最新的日志
	files.sort((a, b) => (a < b ? 1 : -1));
	// console.log(files);
	const newLog = files[0];
	// 没找到日志
	if (!newLog) return null;

	const fileName = path.join(logPath, newLog);
	const fileContent = fs.readFileSync(fileName, { encoding: 'utf-8' });
	// console.log(fileContent.substring(0,1024 * 6));
	let tokenInfo = fileContent.match(tokenRegex);
	if (!tokenInfo) return null;
	const [, token, port] = tokenInfo!;
	if (!token) return null;
	console.log(`获取token成功 https:\/\/riot:${token}@127.0.0.1:${port}\/`);
	return { token, port: +port };
}
