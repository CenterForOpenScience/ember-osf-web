import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('li')
export default class CarouselItem extends Component {
    classNameBindings = ['isActive:active', 'slidingIn:slide-in', 'slidingOut:slide-out', 'from'];

    // Required params
    allItems!: object[];
    @requiredAction
    register!: (item: object) => void;

    // Private params
    index: number = 0;
    slideIndex: number = 0;

    didInsertElement(this: CarouselItem, ...args: any[]) {
        this._super(...args);
        this.register(this);

        const allItems = this.get('allItems');
        this.set('index', allItems.indexOf(this));
        this.set('slideIndex', allItems.indexOf(this) + 1);
    }

    @computed('allItems.@each')
    get isActive() {
        return (this as object) === this.get('allItems').firstObject;
    }

    @computed('isActive')
    get tabIndex() {
        return this.get('isActive') ? 0 : -1;
    }
}
