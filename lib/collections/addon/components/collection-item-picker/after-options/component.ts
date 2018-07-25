import Component from '@ember/component';
import requiredAction from 'ember-osf-web/decorators/required-action';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import layout from './template';

export default class CollectionItemPickerOptions extends Component {
    layout = layout;
    styles = styles;

    isLoading: boolean = this.isLoading;
    hasMore: boolean = defaultTo(this.hasMore, false);

    @requiredAction loadMore!: () => void;
}
