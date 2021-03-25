import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

export type GutterMode = 'column' | 'drawer' | 'page';

@tagName('')
@layout(template)
export default class Gutter extends Component {
    leftClosed: boolean = false;
    leftMode: GutterMode = 'drawer';

    rightClosed: boolean = true;
    rightMode: GutterMode = 'drawer';

    @computed('rightMode', 'rightClosed')
    get rightAnimationClass() {
        return (this.rightMode === 'page' && !this.rightClosed) ? 'SlideLeft' : '';
    }

    @computed('leftMode', 'leftClosed')
    get leftAnimationClass() {
        return (this.leftMode === 'page' && !this.leftClosed) ? styles.SlideRight : '';
    }

    @computed('rightAnimationClass', 'leftAnimationClass')
    get bodyClasses() {
        return `${this.rightAnimationClass} ${this.leftAnimationClass} GutterBody`;
    }
}
