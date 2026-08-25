type EventCallback = (data: unknown) => void;
type ActionPayload = { action: string; data: unknown };
type ActionCallback = (payload: ActionPayload) => void;
type EventEntry = { actions: Record<string, EventCallback[]>; all: ActionCallback[] };

const eventing = {
  events: {} as Record<string, EventEntry>,

  subscribe(eventType: string, action: string | null, callback: EventCallback | ActionCallback): void {
    if (!this.events[eventType]) {
      this.events[eventType] = { actions: {}, all: [] };
    }
    if (action) {
      if (!this.events[eventType].actions[action]) {
        this.events[eventType].actions[action] = [];
      }
      this.events[eventType].actions[action].push(callback as EventCallback);
    } else {
      this.events[eventType].all.push(callback as ActionCallback);
    }
  },

  unsubscribe(eventType: string, action: string | null, callback: EventCallback | ActionCallback): void {
    if (this.events[eventType]) {
      if (action) {
        if (this.events[eventType].actions[action]) {
          this.events[eventType].actions[action] = this.events[eventType].actions[action].filter(
            (cb) => cb !== callback
          );
        }
      } else {
        this.events[eventType].all = this.events[eventType].all.filter(
          (cb) => cb !== callback
        );
      }
    }
  },

  publish(eventType: string, action: string, data: unknown): void {
    if (this.events[eventType]) {
      if (this.events[eventType].actions[action]) {
        this.events[eventType].actions[action].forEach((callback) => callback(data));
      }
      this.events[eventType].all.forEach((callback) => callback({ action, data }));
    }
  },
};

export default eventing;
