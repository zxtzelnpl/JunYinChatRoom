export const sign = (text) =>({
    type:'SIGN',
    text
});

export const log = (name) =>({
    type:'LOG',
    name
});

export const messages = (messages,type) => ({
  type,
  messages
});

export const onlines = (number) =>({
  type:'ONLINE'
  ,number
});
