import { EVENT_KEY } from '@/constants/eventKey';

export default async function useSDKTracking() {
  const SDKInstance = await window.webTrackingSDK.init({
    BUID: 'GAMA-aiaas-01',
    property: 'aiaas',
    sourceProperty: '10',
  });

  const handlePageViewEvent = SDKInstance.passEvent([
    new window.webTrackingSDK.events.PageViewEvent({
      eventId: EVENT_KEY.PAGE_VIEW.EVENT_ID,
      event: EVENT_KEY.PAGE_VIEW.EVENT_NAME,
      pageInfo: { tenant: '10', page: EVENT_KEY.PAGE_VIEW.EVENT_NAME },
    }),
  ]);

  const handleHeartBeatEvent = SDKInstance.passEvent(
    new window.webTrackingSDK.events.PageViewEvent({
      eventId: EVENT_KEY.PAGE_HEARTBEAT.EVENT_ID,
      event: EVENT_KEY.PAGE_HEARTBEAT.EVENT_NAME,
      pageInfo: {
        tenant: '10',
        page: EVENT_KEY.PAGE_HEARTBEAT.EVENT_NAME,
        cumulative_ms: 1000,
      },
    })
  );

  const handleVisibleChangeEvent = SDKInstance.passEvent(
    new window.webTrackingSDK.events.PageViewEvent({
      eventId: EVENT_KEY.VISIBLE_CHANGE.EVENT_ID,
      event: EVENT_KEY.VISIBLE_CHANGE.EVENT_NAME,
      pageInfo: {
        tenant: '10',
        page: EVENT_KEY.VISIBLE_CHANGE.EVENT_NAME,
        cumulative_ms: 1000,
        current_state: 'closed',
      },
    })
  );

  const handleClickEvent = SDKInstance.passEvent(
    new window.webTrackingSDK.events.ClickEvent({
      eventId: EVENT_KEY.CONTENT_CLICK.EVENT_ID,
      event: EVENT_KEY.CONTENT_CLICK.EVENT_NAME,
      pageInfo: {
        tenant: '10',
        page: EVENT_KEY.CONTENT_CLICK.EVENT_NAME,
        sec: 'ai',
        type: 'event_page',
      },
    })
  );
  return {
    handlePageViewEvent,
    handleHeartBeatEvent,
    handleVisibleChangeEvent,
    handleClickEvent,
  };
}
