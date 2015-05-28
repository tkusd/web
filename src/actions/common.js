class ResponseError extends Error {
  constructor(res, body){
    super();

    this.name = 'ResponseError';
    this.message = res.statusText;
    this.response = res;
    this.body = body;
  }
}

export function parseJSON(res){
  return res.json();
}

export function dispatchEvent(context, event){
  return data => {
    context.dispatch(event, data);
    return data;
  };
}

export function filterError(res){
  if (res.status < 200 || res.status > 300){
    return res.json().then(json => {
      return Promise.reject(new ResponseError(res, json));
    });
  }

  return res;
}
