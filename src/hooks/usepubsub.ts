type Subscriber = (value: unknown) => void;

type Topic = {
  name: string;
  value: unknown;
  subscribers: Subscriber[];
};

const topic: Record<string, Topic> = {};

const usePubSub = (topicName: string, initialValue?: unknown) => {
  if (!topic[topicName]) {
    topic[topicName] = {
      name: topicName,
      value: initialValue,
      subscribers: [],
    };
  }

  if (!topic[topicName].value) {
    topic[topicName].value = initialValue;
  }

  const subscribe = (callback: Subscriber) => {

    topic[topicName].subscribers.push(callback);
    callback(topic[topicName] ? topic[topicName].value : initialValue)
    return () => {
      if (topic[topicName] && topic[topicName].subscribers) {
        topic[topicName].subscribers = topic[topicName].subscribers.filter(
          (item) => item !== callback
        );
      }
    };
  };

  const publish = (value: unknown) => {
    if (!topic[topicName]) {
      topic[topicName] = { name: topicName, value: value, subscribers: [] };
    }
    topic[topicName].value = value;
    topic[topicName].subscribers.forEach((callback) => {
      callback(value);
    });
  };

  const data = topic[topicName] ? topic[topicName].value : initialValue;

  return { data, subscribe, publish };
};

export default usePubSub;
