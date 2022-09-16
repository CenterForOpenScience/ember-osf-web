import Media from 'ember-responsive';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
// import { action, computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class Testimonial extends Component {
    @service media!: Media;

    get isMobile() {
        return this.media.isMobile;
    }

    get isTablet() {
        return this.media.isTablet;
    }
}
