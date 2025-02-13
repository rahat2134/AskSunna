export const trackEvent = (eventName, props = {}) => {
    if (window.plausible) {
      window.plausible(eventName, { props });
    }
  };
  
  export const ANALYTICS_EVENTS = {
    QUESTION_ASKED: 'question_asked',
    SOURCE_FILTERED: 'source_filtered',
    FEEDBACK_GIVEN: 'feedback_given',
    PRO_UPGRADED: 'pro_upgraded',
    EXPORT_CHAT: 'export_chat',
    SHARE_ANSWER: 'share_answer'
  };