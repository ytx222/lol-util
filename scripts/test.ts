import { exportTableByName, init } from '../src/index';

await init();

// const userName = '咸鱼养殖塘';
// const userName = '池塘里咸鱼';
// const userName = '征程玉寂寥';
const userName = 'Sue春风自在';
// const userName = '师太别走';
// const userName = '飞霞540888';
// const userName = '伊人何处心无归属';
// const userName = '丨nb';

// const userName = '哦也哦也哦也';
// Sue春风自在
// 征程玉寂寥
exportTableByName(userName);
