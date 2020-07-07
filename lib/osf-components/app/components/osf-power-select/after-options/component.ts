import Component from '@ember/component';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class CollectionItemPickerOptions extends Component {
    isLoading: boolean = this.isLoading;
    hasMore: boolean = defaultTo(this.hasMore, false);

    @requiredAction loadMore!: () => void;
}
