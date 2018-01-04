import { init as consoleInit } from 'promises/another-console';
import { init as appInit } from 'promises/can-touch-this';

export function init() {
  consoleInit();
  appInit();
}
