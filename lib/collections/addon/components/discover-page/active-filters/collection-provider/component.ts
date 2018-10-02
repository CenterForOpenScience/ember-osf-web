import { classNames } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import Theme from 'ember-osf-web/services/theme';
import Base from '../base/component';
import styles from './styles';
import layout from './template';

@classNames('provider collection-provider')
@localClassNames('Component')
export default class ActiveFilterCollectionProvider extends Base {
    layout = layout;
    styles = styles;

    @service theme!: Theme;
}
