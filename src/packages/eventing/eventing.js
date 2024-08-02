// eventBus.js
const eventing = {
    events: {},
  
    subscribe(eventType, action, callback) {
      if (!this.events[eventType]) {
        this.events[eventType] = { actions: {}, all: [] };
      }
      if (action) {
        if (!this.events[eventType].actions[action]) {
          this.events[eventType].actions[action] = [];
        }
        this.events[eventType].actions[action].push(callback);
      } else {
        this.events[eventType].all.push(callback);
      }
    },
  
    unsubscribe(eventType, action, callback) {
      if (this.events[eventType]) {
        if (action) {
          if (this.events[eventType].actions[action]) {
            this.events[eventType].actions[action] = this.events[eventType].actions[action].filter(
              cb => cb !== callback
            );
          }
        } else {
          this.events[eventType].all = this.events[eventType].all.filter(
            cb => cb !== callback
          );
        }
      }
    },
  
    publish(eventType, action, data) {
      console.log("=========== EVENTING publish ============")
      console.log("=========== Subscribers", this.events[eventType])
      if (this.events[eventType]) {
        if (this.events[eventType].actions[action]) {
          this.events[eventType].actions[action].forEach(callback => callback(data));
        }
        this.events[eventType].all.forEach(callback => callback({ action, data }));
      }
    }
  };
  
  export default eventing;
  