import { exportTableByName, init } from '../src/index';

await init();

// const userName = '咸鱼养殖塘';
// const userName = '池塘里咸鱼';

exportTableByName('咸鱼养殖塘');
exportTableByName('池塘里咸鱼');
