import { ref } from 'vue';
import { EVENT_KEY } from '@/constants/eventKey';
import { useFocusedTime } from './useActiveTimeTracker';

declare global {
  interface Window {
    webTrackingSDK: any;
  }
}
const CURRENT_STATE = {
  unfocus: 'unfocus',
  focus: 'focus',
  closed: 'closed',
};

export default function useSDKTracking(sdkInfo: {
  pageName: string;
  tenantID: string;
}) {
  const SDKInstance = ref();
  const { sdkTrackingBUID, sdkTrackingProperty } = useRuntimeConfig().public;
  const handlePageViewEvent = () =>
    SDKInstance.value.passEvent(
      new window.webTrackingSDK.events.PageViewEvent({
        eventId: EVENT_KEY.PAGE_VIEW.EVENT_ID,
        event: EVENT_KEY.PAGE_VIEW.EVENT_NAME,
        pageInfo: { tenant: sdkInfo.tenantID, page: sdkInfo.pageName },
      })
    );
  const handleHeartBeatEvent = (cumulativeMs: number) =>
    SDKInstance.value.passEvent(
      new window.webTrackingSDK.events.PageViewEvent({
        eventId: EVENT_KEY.PAGE_HEARTBEAT.EVENT_ID,
        event: EVENT_KEY.PAGE_HEARTBEAT.EVENT_NAME,
        pageInfo: {
          tenant: sdkInfo.tenantID,
          page: sdkInfo.pageName,
          cumulative_ms: cumulativeMs,
        },
      })
    );

  const handleVisibleChangeEvent = (cumulativeMs: number, state: string) =>
    SDKInstance.value.passEvent(
      new window.webTrackingSDK.events.PageViewEvent({
        eventId: EVENT_KEY.VISIBLE_CHANGE.EVENT_ID,
        event: EVENT_KEY.VISIBLE_CHANGE.EVENT_NAME,
        pageInfo: {
          tenant: sdkInfo.tenantID,
          page: sdkInfo.pageName,
          cumulative_ms: cumulativeMs,
          current_state: state,
        },
      })
    );
  const handleClickEvent = (clickInfo: {
    sec: string;
    type: string;
    audioId: string;
  }) =>
    SDKInstance.value.passEvent(
      new window.webTrackingSDK.events.ClickEvent({
        eventId: EVENT_KEY.CONTENT_CLICK.EVENT_ID,
        event: EVENT_KEY.CONTENT_CLICK.EVENT_NAME,
        pageInfo: {
          tenant: sdkInfo.tenantID,
          page: sdkInfo.pageName,
        },
        click_info: {
          sec: 'ai',
          type: 'audio_tta',
          audio_id: clickInfo.audioId,
        },
      })
    );

  const { focusedTime } = useFocusedTime({
    onEvery30s: () => {
      handleHeartBeatEvent(focusedTime.value);
    },
    onUnfocus: () => {
      handleVisibleChangeEvent(focusedTime.value, CURRENT_STATE.unfocus);
    },
    onRefocus: () => {
      handleVisibleChangeEvent(focusedTime.value, CURRENT_STATE.focus);
    },
    onClose: () => {
      handleVisibleChangeEvent(focusedTime.value, CURRENT_STATE.closed);
    },
    onEnter: () => {
      handlePageViewEvent();
    },
  });

  onBeforeMount(async () => {
    SDKInstance.value = await window.webTrackingSDK.init({
      BUID: sdkTrackingBUID,
      property: sdkTrackingProperty,
      sourceProperty: sdkInfo.tenantID,
    });
  });

  return { focusedTime, handleClickEvent };
}
