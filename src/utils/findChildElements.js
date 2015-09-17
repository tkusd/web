export default function findChildElements(elements, id){
  const children = elements.filter(element => element.get('element_id') === id);
  let result = children;

  children.forEach(element => {
    result = result.concat(findChildElements(elements, element.get('id')));
  });

  return result;
}
