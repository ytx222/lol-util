import isElevated from 'is-elevated';
import { execSync, exec, spawn } from 'child_process';
import pty from 'node-pty';
import iconv from 'iconv-lite';
import path from 'path';
import { fileURLToPath } from 'url';
import sudo from 'sudo-prompt';

import log4js from 'log4js';

const _logger = log4js.getLogger();
const _fileLogger = log4js.getLogger('file');
const log = {
	info: (...args) => _logger.info(...args),
	debug:(...args) => _fileLogger.debug(...args),
}
log4js.addLayout('info', function () {
	return function (logEvent) {
		// console.log({ logEvent });
		const date = new Date(logEvent.startTime);
		return `[${date.toLocaleString()}] pid:${logEvent.pid} - ${
			[...logEvent.data]
				.map(e => {
					return typeof e === 'object' ? JSON.stringify(e) : e;
				})
				.join(' - ')

			//
		}`;
	};
});
log4js.configure({
	appenders: {
		// 输出到文件的输出器
		file: {
			type: 'fileSync',
			filename: relativeFilePath('log4.txt'),
			// 100 mb
			maxLogSize: 1024 * 1024 * 100,
			backups: 3,
			layout: { type: 'info' },
		},
		// 输出到控制台
		console: {
			type: 'console',
			layout: { type: 'info' },
		},
		// 输出
		// format: { type: "stdout", layout: { type: "basic" } }
	},
	categories: {
		default: {
			appenders: ['file', 'console'],
			level: 'info',
		},
		file: {
			appenders: ['file'],
			level: 'debug',
		},
	},

	// pm2: true,
	// disableClustering: true,
});
// log4js.shutdown(() => {
// 	// logger.warn('程序关闭');
// 	console.log('111111');
// 	return 0
// });

// import winston from 'winston';

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   defaultMeta: { service: 'user-service' },
//   transports: [
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.File({ filename: relativeFilePath('log.txt') }),
//   ],
// });

// //
// // If we're not in production then log to the `console` with the format:
// // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// //
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }

// logger.info('1111')
// logger.warn(relativeFilePath('log.txt'))

function relativeFilePath(_path) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	return path.resolve(__dirname, _path);
}

const processName = 'League of Legends.exe';
const fileName = 'League of Legends.exe';
const timeBase = 2;
// 没有打开客户端 x3
let noLCUTimes = 1;
// 打开了客户端,但是没有进入游戏 x0.5
let noGameBase = 1;

const getTimeBase = () => timeBase * noLCUTimes * noGameBase;

// let timeBase = 6;

// const processName = 'Everything.exe';
// const fileName = 'Everything.exe';

//TODO:如果没找到lol游戏进程,时间*5
// 查找wegame进程
// tasklist | findstr "LeagueClient.exe"
// tasklist | findstr "League of Legends.exe"

var nextSec = 0;

function task() {
	let { pid, status } = {};
	try {
		({ pid, status } = getProcessId(processName, fileName));
	} catch (e) {
		// logger.info(e);
		log.info('....查询lol进程失败');
	}

	const loggerObj = {
		pid: pid || '-',
		status,
	};

	//status = 2 时才可能会有pid
	if (pid) {
		let priority = getPriority(pid);
		loggerObj['进程'] = pid;
		loggerObj['优先级'] = priority;

		if (priority < 24) {
			// 提升优先级
			setpriority(pid, 256);
		} else {
			// 优先级够大了或者拿不到优先级,啥都不做
			// timeBase = 60
		}
		next(2);
	} else if (status === 1) {
		// 没有pid,但是找到了lol相关进程
		next(1);
	} else {
		// 没有lol相关进程 3分钟
		// log.info('没有lol相关进程 3分钟');
		next(6);
	}


	log.info(loggerObj, `等待 ${nextSec} 秒`);
}

const next = m => {
	// log.info(`等待 ${} 秒\n`);
	nextSec = m * timeBase;
	setTimeout(task, 1000 * nextSec);
};
//

// getProcessId(processName)
function getProcessId(name, filterName) {
	const command = `tasklist | findstr "${name}"`;
	let res = execSync(command);
	// log.info(1111);
	let t = res.toString();
	// log.info(t);
	let item = t.split('\n').find(e => e.startsWith(filterName));
	item && log.debug(`tasklist | findstr "${name}"\n${item?.trim()}\n`);
	if (item) {
		// 名称中会有空格,直接去掉 懒得用正则
		// League of Legends.exe
		// League of Legends.exe        30644 Console                    1  1,457,368 K
		item = item.replace(name, '');
		let t = item.split(/[\s\r]+/).filter(Boolean);
		// log.info(t);
		let pid = t[0];
		return { pid, status: 2 };

		// log.info(pid);
	} else if (t.includes('LeagueClient.exe')) {
		return { status: 1 };
	}
	return { status: 0 };
}

function getPriority(processId) {
	const command = `wmic process where "ProcessId=${processId}" get Priority`;
	let res = execSync(command);
	const outputLines = res.toString().trim().split('\n');
	const priorityLine = outputLines[1] || ''; // 第二行包含优先级信息
	const priority = priorityLine?.trim?.();

	log.debug(`进程 ${processId} 的优先级: ${priority}`);
	if (priority && priority == +priority) {
		return +priority;
	}
	return null;
	// 8 = 正常
	// 24 = 实时
	/**
     * 实时级别（Realtime）：级别值为 24-31，表示实时优先级。这是最高优先级，通常用于需要立即响应的关键任务。使用该级别的进程会优先执行，但要小心使用，以免影响系统的稳定性和响应性。
  高级别（High）：级别值为 13-23，表示高优先级。这个级别适用于需要优先处理的任务，但不像实时级别那样对系统资源要求极高。
  高于正常级别（Above Normal）：级别值为 10-12，表示略高于正常优先级。这个级别对于重要但不需要特别高响应性的任务是合适的。
  正常级别（Normal）：级别值为 7-9，表示正常优先级。这是大多数进程的默认优先级。
  低于正常级别（Below Normal）：级别值为 4-6，表示略低于正常优先级。适用于后台任务或不需要优先处理的任务。
  低级别（Low）：级别值为 1-3，表示低优先级。这个级别适用于对系统资源要求较低且不需要优先执行的任务。
  空闲级别（Idle）：级别值为 0，表示空闲优先级。该级别适用于系统空闲时执行的任务，对系统资源的占用最低。
     */
}

/**
# 32 正常
# 64 稍微高
# 128 高
# 256 实时
 */
function setpriority(pid, priority) {
	const command = `wmic process where "ProcessId=${pid}"  call setpriority ${priority}`;
	let res = execSync(command);
	log.info('====setpriority');
}

/**
 * toSudo方法看起来是异步获取了管理员权限,但其实不是,
 * 如果没有管理员权限,会停止运行并重新以管理员权限运行脚本
 * @param {*} callback
 */
function toSudo(callback) {
	log.info('toSudo');
	isElevated().then(elevated => {
		if (elevated) {
			log.info('当前进程以管理员权限运行。');
			callback();
		} else {
			log.info('当前进程没有管理员权限。');
			// log.info('./elevate.exe /k /u "node ./sheel.mjs"');
			sudo.exec(
				`node ${relativeFilePath('shell.mjs')}`,
				{ name: 'ytx222 lol util' },
				function (error, stdout, stderr) {
					if (error) throw error;
					// 当前进程结束后才能获取到返回的值
					log.info('stdout: ' + stdout);
				}
			);
		}
	});
}

log.info('======================== 程序启动');

toSudo(() => {
	task();
});
