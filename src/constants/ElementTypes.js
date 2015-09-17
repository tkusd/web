import keyMirror from 'keymirror';

export default keyMirror({
  screen: null,
  navbar: null,
  toolbar: null,
  label: null,
  card: null,
  button: null,
  block: null,
  buttonRow: null,
  list: null,
  image: null,
  listItem: null,
  listDivider: null,
  listGroup: null,
  accordion: null,
  inputText: null,
  inputSelect: null,
  inputCheckbox: null,
  inputSlider: null,
  searchBar: null
});

export const events = keyMirror({
  click: null,
  init: null,
  change: null,
  itemClick: null
});
