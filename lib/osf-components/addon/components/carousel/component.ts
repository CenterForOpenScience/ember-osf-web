import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import CarouselItem from 'osf-components/components/carousel/x-item/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class Carousel extends Component {
    // Private properties
    carouselItems: CarouselItem[] = [];

    @action
    register(item: CarouselItem) {
        this.carouselItems.pushObject(item);
        this.carouselItems[0].set('isActive', true);
    }

    @action
    changeSlide(direction: string) {
        const activeIndex = this.carouselItems.findIndex(item => item.isActive);
        let newIndex = activeIndex;

        if (direction === 'previous') {
            newIndex = activeIndex - 1 < 0 ? this.carouselItems.length - 1 : activeIndex - 1;
        } else if (direction === 'next') {
            newIndex = activeIndex + 1 >= this.carouselItems.length ? 0 : activeIndex + 1;
        }

        this.carouselItems.forEach((item, index) => {
            item.set('isActive', index === newIndex);
        });
    }

    @action
    navClick(item: CarouselItem) {
        const activeSlide = this.carouselItems.findBy('active');
        const activeIndex = activeSlide!.index;
        const newIndex = item.index;

        this.carouselItems[activeIndex].set('isActive', false);
        this.carouselItems[newIndex].set('isActive', true);
    }
}
