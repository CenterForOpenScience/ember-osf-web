import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import CarouselItem from 'osf-components/components/carousel/x-item/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class Carousel extends Component {
    // Private properties
    carouselItems: CarouselItem[] = [];

    @computed('carouselItems.{length,@each.isActive}')
    get activeSlide() {
        return this.carouselItems.findBy('isActive');
    }

    @action
    register(item: CarouselItem) {
        this.carouselItems.pushObject(item);
    }

    @action
    changeSlide(direction: string) {
        const activeSlide = this.carouselItems.findBy('isActive');
        const activeIndex = activeSlide!.index;
        let newIndex = direction === 'previous' ? activeIndex - 1 : activeIndex + 1;

        if (newIndex > this.carouselItems.length - 1) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = this.carouselItems.length - 1;
        }

        this.carouselItems[activeIndex].set('isActive', false);
        this.carouselItems[newIndex].set('isActive', true);
    }

    @action
    navClick(item: CarouselItem) {
        const activeSlide = this.carouselItems.findBy('isActive');
        const activeIndex = activeSlide!.index;
        const newIndex = item.index;

        this.carouselItems[activeIndex].set('isActive', false);
        this.carouselItems[newIndex].set('isActive', true);
    }
}
