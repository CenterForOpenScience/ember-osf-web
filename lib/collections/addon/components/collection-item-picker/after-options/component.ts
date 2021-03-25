import Component from '@ember/component';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class CollectionItemPickerOptions extends Component {
    isLoading!: boolean;
    hasMore: boolean = false;

    @requiredAction loadMore!: () => void;
}
