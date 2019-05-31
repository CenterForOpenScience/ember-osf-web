import Component from '@ember/component';

import config from 'ember-get-config';
import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

const {
    OSF: {
        learnMore,
    },
} = config;

@layout(template, styles)
export default class LearnMoreButton extends Component {
    learnMore: string = learnMore;
}
