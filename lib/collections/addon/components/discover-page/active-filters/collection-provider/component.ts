import { classNames } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import Theme from 'ember-osf-web/services/theme';

import Base from '../base/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@classNames('provider collection-provider')
@localClassNames('Component')
export default class ActiveFilterCollectionProvider extends Base {
    @service theme!: Theme;
}
