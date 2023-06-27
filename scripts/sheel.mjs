import isElevated from 'is-elevated';
import { execSync, exec ,spawn} from 'child_process';
import pty from 'node-pty';
import os from 'os';
import ps from 'ps-node';
/**
 *
 wmic process where "ProcessId=15820" get Priority
 */

const processName = 'League of Legends.exe'; // 替换为实际的进程名

getProcessId(processName)
function getProcessId(name){
  const command = ` tasklist | findstr "${name}"`;
  let res = execSync(command);
  let t=res.toString()
  // console.log(t);
  let item = t.split('\n').find(e=>e.startsWith('LeagueClient.exe'))
  // console.log(item);
  if (item) {
    let t = item.split(/[\s\r]+/)
    let pid = t[1];
    if (pid) {
      let priority= getPriority(pid)
      if (priority <= 24) {
        // 提升优先级
        setpriority(pid)
      } else {
        // 优先级够大了,啥都不做
      }
    }
    // console.log(pid);
  }


  // getPriority(2864);
}


 function getPriority(processId) {
	// const processId = 15820; // 替换为实际的进程ID

	const command = `wmic process where "ProcessId=${processId}" get Priority`;
	let res = execSync(command);
	const outputLines = res.toString().trim().split('\n');
	const priorityLine = outputLines[1]; // 第二行包含优先级信息
	const priority = priorityLine.trim();

	console.log(`进程 ${processId} 的优先级: ${priority}`);
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

function setpriority(pid){
  isElevated().then(elevated => {
    // return;
    if (elevated) {
      console.log('当前进程以管理员权限运行。');
      setTimeout(() => {
        console.log(1);
      }, 9999999);
    } else {
      console.log('当前进程没有管理员权限。');

      // 获取管理员权限重新运行此脚本
      // runas /user:ytx 'wmic process where ProcessId=15820 call setpriority 256'
      // execSync('runas /user:ytx "node ./sheel.mjs"');
      // execSync('0222')

      // 创建一个伪终端
      const term = pty.spawn(os.platform() === 'win32' ? 'cmd.exe' : 'bash', [], {
        name: os.platform() === 'win32' ? 'cmd.exe' : 'bash',
        cwd: process.cwd(),
        env: process.env,
      });

      // 监听伪终端的数据输出
      term.on('data', data => {
        console.log(data);

        // 检查输出是否需要输入密码
        if (data.includes('输入 ytx 的密码')) {
          // 输入密码
          term.write('0222\r\n'); // 替换为实际的密码
        } else {
        }
      });

      // 执行需要输入密码的 shell 命令
      term.write(`runas /user:ytx 'start /B cmd /c "node .\scripts\sheel.mjs"'\r\n`); // 替换为实际的命令
    }
  });

}



console.log('========================');


// const uint8Array = new Uint8Array([
// 	202, 228, 200, 235, 32, 121, 116, 120, 32, 181, 196, 195, 220, 194, 235, 58, 32, 0, 13, 10,
// ]);
// const result = String.fromCharCode.apply(null, uint8Array);
// console.log(result); // 输出: "Hello"
