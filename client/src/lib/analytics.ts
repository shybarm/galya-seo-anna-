type EventType = 
  | 'contact_form_submit'
  | 'appointment_booking'
  | 'chat_open'
  | 'chat_message'
  | 'phone_click'
  | 'email_click'
  | 'whatsapp_click'
  | 'page_view'
  | 'scroll_to_section';

type EventCategory = 'conversion' | 'engagement' | 'interaction';

interface TrackEventOptions {
  eventType: EventType;
  eventCategory: EventCategory;
  eventData?: Record<string, unknown>;
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

export async function trackEvent(options: TrackEventOptions): Promise<void> {
  try {
    const payload: Record<string, string> = {
      eventType: options.eventType,
      eventCategory: options.eventCategory,
      sessionId: getSessionId(),
    };
    
    if (options.eventData) {
      payload.eventData = JSON.stringify(options.eventData);
    }

    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
}

export function trackConversion(eventType: EventType, data?: Record<string, unknown>): void {
  trackEvent({
    eventType,
    eventCategory: 'conversion',
    eventData: data,
  });
}

export function trackEngagement(eventType: EventType, data?: Record<string, unknown>): void {
  trackEvent({
    eventType,
    eventCategory: 'engagement',
    eventData: data,
  });
}

export function trackInteraction(eventType: EventType, data?: Record<string, unknown>): void {
  trackEvent({
    eventType,
    eventCategory: 'interaction',
    eventData: data,
  });
}

export function trackPhoneClick(): void {
  trackInteraction('phone_click');
}

export function trackEmailClick(): void {
  trackInteraction('email_click');
}

export function trackWhatsAppClick(): void {
  trackInteraction('whatsapp_click');
}

export function trackChatOpen(): void {
  trackEngagement('chat_open');
}

export function trackContactFormSubmit(subject?: string): void {
  trackConversion('contact_form_submit', { subject });
}

export function trackAppointmentBooking(appointmentType?: string): void {
  trackConversion('appointment_booking', { appointmentType });
}
