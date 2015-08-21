import BaseStore from './BaseStore';
import Immutable, {Map} from 'immutable';
import ElementTypes, {events} from '../constants/ElementTypes';

const COMPONENTS = [
  {
    type: ElementTypes.screen,
    hidden: true,
    container: true,
    attributes: {
      theme: {
        type: 'string',
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
    attributes: {
      title: {
        type: 'string',
        label: 'Title'
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
        type: 'string',
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
      ElementTypes.buttonRow
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
        label: 'Raised',
        platform: 'android'
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
      ElementTypes.buttonRow
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
    availableChildTypes: [
      ElementTypes.listItem,
      ElementTypes.listDivider,
      ElementTypes.listGroup
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
    availableChildTypes: [ElementTypes.label],
    attributes: {
      media: {
        type: 'string',
        label: 'Media'
      },
      title: {
        type: 'string',
        label: 'Title',
        defaultValue: 'List item'
      },
      link: {
        type: 'boolean',
        label: 'Link'
      }
    }
  },
  {
    type: ElementTypes.listDivider,
    container: false,
    attributes: {
      title: {
        type: 'string',
        label: 'Title',
        defaultValue: 'List divider'
      }
    }
  },
  {
    type: ElementTypes.listGroup,
    container: true,
    availableChildTypes: [
      ElementTypes.listItem,
      ElementTypes.listDivider
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
  }
];

class ComponentStore extends BaseStore {
  constructor(context){
    super(context);

    this.data = Map().withMutations(data => {
      COMPONENTS.forEach(item => {
        data.set(item.type, Immutable.fromJS(item));
      });
    });
  }

  shouldDehydrate(){
    return false;
  }

  get(id){
    return this.data.get(id);
  }

  getList(){
    return this.data;
  }
}

export default ComponentStore;
