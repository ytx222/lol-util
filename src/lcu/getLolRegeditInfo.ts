import child_process from 'child_process';
const keyPath = 'HKEY_CURRENT_USER\\Software\\Tencent\\LOL'; //选择要修改或者保存或者删除的路径（操作路径）

var encoding = 'cp936';
var binaryEncoding = 'binary' as 'binary';

import iconv from 'iconv-lite';
var encoding = 'cp936';

export function getLoLPath(): Promise<string> {
	return new Promise((resolve, reject) => {
		//查
		child_process.exec(`REG QUERY ${keyPath} /v InstallPath`, { encoding: binaryEncoding }, function (error, stdout, stderr) {
			// console.log('stdout:' + stdout);



			if (error != null) {
				console.log('exec error:' + error);
				reject(iconv.decode(new Buffer(stderr, binaryEncoding), encoding));
			}
			const res = iconv.decode(new Buffer(stdout, binaryEncoding), encoding);
			const t = res.split(/\s+/).filter(e => e);
			// console.log(t);
			// console.log(t[3]);
			if (!t || t.length < 4) resolve('');
			else resolve(t[3]);
		});
	});
}
// let t = await getLoLPath();
// console.log(t);
