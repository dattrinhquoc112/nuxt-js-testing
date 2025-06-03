export const TUTORIAL_TYPE = {
  HOME_PAGE: 'HOME_PAGE',
  WEB_EDITOR: 'WEB_EDITOR',
};
export const DEBOUND_TIME_SAVE_HISTORY = 300;
export const DEFAULT_WEB_EDITOR_NAME = '未命名專案';
export const MAXIMUM_WEB_EDITOR_NAME = 50;

export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  GUIDE: 'guide',
};
export const SIDE_BAR_ACTION = {
  CLICKED_SESSION: 'clicked_session',
  CLICKED_AI_TOOLS: 'clicked_ai_tools',
  CLICKED_CAPACITY: 'clicked_capacity',
};
export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];
