import BaseStore from './BaseStore';
import Immutable, {Map, OrderedMap} from 'immutable';
import ElementTypes, {events} from '../constants/ElementTypes';
import findChildElements from '../utils/findChildElements';

const COMPONENTS = [
  {
    type: ElementTypes.screen,
    hidden: true,
    container: true,
    availableEventTypes: [
      events.init
    ],
    availableChildTypes: [
      ElementTypes.navbar,
      ElementTypes.toolbar,
      ElementTypes.label,
      ElementTypes.card,
      ElementTypes.button,
      ElementTypes.block,
      ElementTypes.buttonRow,
      ElementTypes.list,
      ElementTypes.image,
      ElementTypes.inputText,
      ElementTypes.inputSelect,
      ElementTypes.inputCheckbox,
      ElementTypes.inputSlider,
      ElementTypes.searchBar
    ],
    attributes: {
      theme: {
        type: 'theme',
        label: 'Theme'
      }
    }
  },
  {
    type: ElementTypes.navbar,
    container: true,
    availableEventTypes: [
      events.click
    ],
    availableChildTypes: [
      ElementTypes.button,
      ElementTypes.label,
      ElementTypes.inputText,
      ElementTypes.inputSelect,
      ElementTypes.inputCheckbox,
      ElementTypes.inputSlider

    ],
    childAttributes: {
      position: {
        type: 'select',
        label: 'Position',
        values: [
          {value: '', label: 'Content'},
          {value: 'left', label: 'Left'},
          {value: 'right', label: 'Right'}
        ],
        defaultValue: ''
      }
    }
  },
  {
    type: ElementTypes.toolbar,
    container: true,
    availableEventTypes: [
      events.click
    ]
  },
  {
    type: ElementTypes.label,
    container: false,
    availableEventTypes: [
      events.click
    ],
    attributes: {
      text: {
        type: 'textarea',
        defaultValue: 'Label',
        label: 'Text'
      }
    }
  },
  {
    type: ElementTypes.card,
    container: true,
    availableEventTypes: [
      events.click
    ],
    availableChildTypes: [
      ElementTypes.label,
      ElementTypes.button,
      ElementTypes.buttonRow,
      ElementTypes.image,
      ElementTypes.inputText,
      ElementTypes.inputSelect,
      ElementTypes.inputCheckbox,
      ElementTypes.inputSlider
    ],
    attributes: {
      header: {
        type: 'boolean',
        label: 'Header'
      },
      footer: {
        type: 'boolean',
        label: 'Footer'
      }
    },
    childAttributes: {
      position: {
        type: 'select',
        label: 'Position',
        values: [
          {value: '', label: 'Content'},
          {value: 'header', label: 'Header'},
          {value: 'footer', label: 'Footer'}
        ]
      }
    }
  },
  {
    type: ElementTypes.button,
    container: false,
    availableEventTypes: [
      events.click
    ],
    attributes: {
      text: {
        type: 'string',
        defaultValue: 'Button',
        label: 'Text'
      },
      active: {
        type: 'boolean',
        label: 'Active'
      },
      round: {
        type: 'boolean',
        label: 'Round'
      },
      fill: {
        type: 'boolean',
        label: 'Fill'
      },
      big: {
        type: 'boolean',
        label: 'Big'
      },
      raised: {
        type: 'boolean',
        label: 'Raised'
      }
    }
  },
  {
    type: ElementTypes.block,
    container: true,
    availableChildTypes: [
      ElementTypes.label,
      ElementTypes.card,
      ElementTypes.button,
      ElementTypes.buttonRow,
      ElementTypes.inputText,
      ElementTypes.inputSelect,
      ElementTypes.inputCheckbox,
      ElementTypes.inputSlider
    ],
    attributes: {
      title: {
        type: 'string',
        label: 'Title',
        defaultValue: 'Block'
      }
    }
  },
  {
    type: ElementTypes.buttonRow,
    container: true,
    availableChildTypes: [ElementTypes.button]
  },
  {
    type: ElementTypes.list,
    container: true,
    availableEventTypes: [
      events.itemClick
    ],
    availableChildTypes: [
      ElementTypes.listItem,
      ElementTypes.listDivider,
      ElementTypes.listGroup,
      ElementTypes.accordion
    ],
    attributes: {
      title: {
        type: 'string',
        label: 'Title',
        defaultValue: 'List'
      },
      inset: {
        type: 'boolean',
        label: 'Inset'
      }
    }
  },
  {
    type: ElementTypes.listItem,
    container: true,
    availableChildTypes: [
      ElementTypes.label,
      ElementTypes.image,
      ElementTypes.button,
      ElementTypes.inputText,
      ElementTypes.inputSelect,
      ElementTypes.inputCheckbox,
      ElementTypes.inputSlider
    ],
    availableEventTypes: [
      events.click
    ],
    attributes: {
      link: {
        type: 'boolean',
        label: 'Link'
      }
    },
    childAttributes: {
      position: {
        type: 'select',
        label: 'Position',
        values: [
          {value: 'left', label: 'Left'},
          {value: 'right', label: 'Right'}
        ],
        defaultValue: 'left'
      }
    }
  },
  {
    type: ElementTypes.listDivider,
    container: false,
    attributes: {
      text: {
        type: 'string',
        label: 'Text',
        defaultValue: 'List divider'
      }
    }
  },
  {
    type: ElementTypes.listGroup,
    container: true,
    availableChildTypes: [
      ElementTypes.listItem,
      ElementTypes.listDivider,
      ElementTypes.accordion
    ],
    attributes: {
      title: {
        type: 'String',
        label: 'Title',
        defaultValue: 'List group'
      }
    }
  },
  {
    type: ElementTypes.image,
    container: false,
    attributes: {
      src: {
        type: 'asset',
        label: 'Image'
      }
    }
  },
  {
    type: ElementTypes.accordion,
    container: true,
    availableChildTypes: [
      ElementTypes.block,
      ElementTypes.label,
      ElementTypes.button,
      ElementTypes.buttonRow,
      ElementTypes.image,
      ElementTypes.inputText,
      ElementTypes.inputSelect,
      ElementTypes.inputCheckbox,
      ElementTypes.inputSlider
    ],
    childAttributes: {
      position: {
        type: 'select',
        label: 'Position',
        values: [
          {value: '', label: 'Content'},
          {value: 'title', label: 'Title'}
        ]
      }
    }
  },
  {
    type: ElementTypes.inputText,
    container: false,
    availableEventTypes: [
      events.change
    ],
    attributes: {
      value: {
        type: 'string',
        label: 'Value'
      },
      type: {
        type: 'select',
        label: 'Type',
        values: [
          {value: 'text', label: 'Text'},
          {value: 'email', label: 'Email'},
          {value: 'url', label: 'URL'},
          {value: 'password', label: 'Password'},
          {value: 'tel', label: 'Telephone'},
          {value: 'date', label: 'Date'},
          {value: 'datetime', label: 'Date & Time'}
        ],
        defaultValue: 'text'
      },
      placeholder: {
        type: 'string',
        label: 'Placeholder'
      }
    }
  },
  {
    type: ElementTypes.inputCheckbox,
    container: false,
    availableEventTypes: [
      events.change
    ],
    attributes: {
      checked: {
        type: 'boolean',
        label: 'Checked'
      }
    }
  },
  {
    type: ElementTypes.inputSlider,
    container: false,
    availableEventTypes: [
      events.change
    ],
    attributes: {
      min: {
        type: 'number',
        label: 'Min'
      },
      max: {
        type: 'number',
        label: 'Max'
      },
      step: {
        type: 'number',
        label: 'Step'
      },
      value: {
        type: 'number',
        label: 'Value'
      }
    }
  },
  {
    type: ElementTypes.searchBar,
    container: false,
    availableEventTypes: [
      events.change
    ],
    attributes: {
      placeholder: {
        type: 'string',
        label: 'Placeholder',
        defaultValue: 'Search'
      },
      list: {
        type: 'select',
        label: 'List',
        values(props){
          const elements = findChildElements(props.elements, props.selectedScreen);

          let options = elements.filter(element => element.get('type') === ElementTypes.list)
            .map(element => Map({
              value: element.get('id'),
              label: element.get('name')
            }))
            .toList();

          return options.unshift(Map({
            value: '',
            label: ''
          }));
        }
      }
    }
  }
];

class ComponentStore extends BaseStore {
  constructor(context) {
    super(context);

    this.data = OrderedMap().withMutations(data => {
      COMPONENTS.forEach(item => {
        data.set(item.type, Immutable.fromJS(item));
      });
    });
  }

  shouldDehydrate() {
    return false;
  }

  get(id) {
    return this.data.get(id);
  }

  getList() {
    return this.data;
  }
}

export default ComponentStore;
