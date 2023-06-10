import { exportTableByName, init } from '../src/index';

await init();

// const userName = '咸鱼养殖塘';
// const userName = '池塘里咸鱼';

await exportTableByName('咸鱼养殖塘','backup/');
await exportTableByName('池塘里咸鱼','backup/');
