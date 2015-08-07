export function dispatchEvent(context, event){
  return data => {
    context.dispatch(event, data);
    return data;
  };
}
