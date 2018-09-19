import { layout } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import styles from './styles';
import template from './template';
import itemStyles from './x-item/styles';

@layout(template)
@localClassNames('CommaList')
export default class CommaList<T> extends Component {
    static positionalParams = ['items'];

    items!: T[];
    cutOff?: number = undefined;

    resizeCallback: any;

    extra = 0;

    onResize = task(function *(this: CommaList<T>) {
        yield timeout(500);

        const results = this.$(`.${styles.CommaList__List}`);
        if (!results || results.length < 1) {
            return;
        }

        const parentBounds = results[0].getBoundingClientRect();

        const i = this.$(`.${itemStyles.Item}`).toArray().findIndex(el => {
            return el.getBoundingClientRect().right > parentBounds.right;
        }) - 1;

        this.set('cutOff', i > 0 ? i : undefined);
    }).restartable();

    @computed('cutOff', 'filteredItems.length')
    get cutOffOrLast(this: CommaList<T>) {
        return this.cutOff || (this.filteredItems.length - 1);
    }

    @computed('items.[]')
    get filteredItems(this: CommaList<T>) {
        return this.items.filter(this.filter);
    }

    @computed('extra', 'cutOff', 'filteredItems.length')
    get unshown() {
        return this.extra + (this.filteredItems.length - (this.cutOff ? this.cutOff + 1 : this.filteredItems.length));
    }

    @computed('unshown')
    get hasUnshown() {
        return this.unshown > 0;
    }

    filter(item: T): boolean {
        return Boolean(item);
    }

    didInsertElement(this: CommaList<T>) {
        this.set('resizeCallback', () => this.get('onResize').perform());
        $(window).resize(this.resizeCallback);
        this.resizeCallback();
    }

    willDestroyElement() {
        $(window).off('resize', this.resizeCallback);
    }
}
