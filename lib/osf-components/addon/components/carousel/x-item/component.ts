import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class CarouselItem extends Component {
    // Required parameters
    allItems!: CarouselItem[];
    @requiredAction register!: (item: CarouselItem) => void;

    // Optional parameters
    isActive?: Boolean;

    // Private properties
    index = 0;
    slideIndex = 0;

    didInsertElement() {
        super.didInsertElement();
        this.register(this);
        this.set('index', this.allItems.indexOf(this));
        this.set('slideIndex', this.allItems.indexOf(this) + 1);
    }

    @computed('allItems.[]', 'isActive')
    get active() {
        if (this.isActive === true){
            return true;
        }
        if (this.isActive === false){
            return false;
        }
        return this === this.allItems[0];
    }

    @computed('active')
    get tabIndex() {
        return this.active ? 0 : -1;
    }
}
