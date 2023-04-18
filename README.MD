PostLolSummonerV1Summoners



https://www.52nfw.cn/16689.html

查询召唤师id

https://riot:2o8cNyXgDJvBDIlavM5_Gg@127.0.0.1:7415/lol-summoner/v1/summoners?name=咸鱼养殖塘
https://riot:2o8cNyXgDJvBDIlavM5_Gg@127.0.0.1:7415/lol-match-history/v3/matchlist/account/4005857266?begIndex=1&endIndex=20



const QString SummonerUrl = "https://riot:%1@127.0.0.1:%2/lol-summoner/v1/current-summoner";
const QString LobbyUrl = "https://riot:%1@127.0.0.1:%2/lol-lobby/v2/lobby";


 wmic process where name='LeagueClient.exe' GET ExecutablePath

  wmic process where name='LeagueClientUxRender.exe' GET ExecutablePath
  wmic process where name='LeagueCrashHandler.exe' GET ExecutablePath


wmic process get name,executablepath,processid

wmic process where "name='LeagueClient.exe'" GET executablepath


wmic process where "name='Code.exe'" GET executablepath

理论上应该得到这个
D:\WeGameApps\英雄联盟\LeagueClient


https://riot:UbYTuRsyfx4R63Jwvem7vw@127.0.0.1:3530/bootstrap.html

https://riot:sx6SrO4FupMdrN3JtIvpSA@127.0.0.1:6551/index.html





  https://lol.qq.com/client/client_lcu.shtml#protocol=https:&port=6551
  https://lol.qq.com/client/v2/index.html#/


  HKEY_CURRENT_USER\Software\Tencent\LOL

  // 实在不行读日志文件也是可以的
  然后后面再研究研究node打包exe



```
战绩信息 key

games []
gameMode  			游戏模式
	ARAM 大乱斗
	CLASSIC 可能是人机 翻译是经典
	URF		无限火力
gameType  			游戏类型  MATCHED_GAME 匹配到的
gameDuration		游戏时长 应该是秒


games[].participants

championId 			英雄id
查询可以使用


physicalDamageDealtToChampions 对英雄物理伤害
totalDamageDealtToChampions    对英雄总伤害
totalDamageTaken				承受总伤害
damageSelfMitigated				缓和伤害
goldEarned						总打钱
goldSpent						总使用金币
deaths							死亡次数
assists							助攻
kills							击杀,人头
totalMinionsKilled				小兵击杀
totalTimeCrowdControlDealt		人群控制处理的总时间,也是自己造成控制相关的
timeCCingOthers					控制得分
damageDealtToTurrets			防御塔伤害
```

{
	"accountId": 4007457091,
	"displayName": "咸鱼养殖塘",
	"internalName": "咸鱼养殖塘",
	"nameChangeFlag": false,
	"percentCompleteForNextLevel": 58,
	"privacy": "PUBLIC",
	"profileIconId": 5411,
	"puuid": "2583df84-c083-5227-a872-3855d3e34ef6",
	"rerollPoints": {
		"currentPoints": 500,
		"maxRolls": 2,
		"numberOfRolls": 2,
		"pointsCostToRoll": 250,
		"pointsToReroll": 0
	},
	"summonerId": 4007457091,
	"summonerLevel": 620,
	"unnamed": false,
	"xpSinceLastLevel": 2038,
	"xpUntilNextLevel": 3456
}
