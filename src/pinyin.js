import { pinyin } from 'pinyin-pro';
import { alignReadings } from './annotations.js';

export function annotate(text) {
  const rows = pinyin(text, { type: 'all', toneType: 'symbol' })
    .map(item => [item.origin, item.isZh ? item.pinyin : null]);
  return alignReadings(text, rows, 'zh');
}
