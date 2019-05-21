import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class Carousel extends Component {
    // Private params
    carouselItems: any[] = [];

    @computed('carouselItems.{length,@each.isActive}')
    get activeSlide() {
        return this.get('carouselItems').findBy('isActive');
    }

    @action
    register(item: any) {
        this.get('carouselItems').pushObject(item);
    }

    @action
    changeSlide(direction: string) {
        const activeSlide = this.get('carouselItems').findBy('isActive');
        const activeIndex = activeSlide.index;
        let newIndex = direction === 'previous' ? activeIndex - 1 : activeIndex + 1;

        if (newIndex > this.get('carouselItems').length - 1) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = this.get('carouselItems').length - 1;
        }

        this.get('carouselItems')[activeIndex].setProperties({
            isActive: false,
        });

        this.get('carouselItems')[newIndex].setProperties({
            isActive: true,
        });
    }
}
