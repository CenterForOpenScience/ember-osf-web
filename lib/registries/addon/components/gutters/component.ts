import { layout, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

export type GutterMode = 'column' | 'drawer' | 'page';

@tagName('')
@layout(template)
export default class Gutter extends Component {
    leftClosed: boolean = defaultTo(this.leftClosed, false);
    leftMode: GutterMode = defaultTo(this.leftMode, 'drawer');

    rightClosed: boolean = defaultTo(this.rightClosed, true);
    rightMode: GutterMode = defaultTo(this.rightMode, 'drawer');

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
