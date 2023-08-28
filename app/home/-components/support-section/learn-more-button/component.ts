import Component from '@ember/component';

import config from 'ember-osf-web/config/environment';

const {
    OSF: {
        learnMoreUrl,
    },
} = config;

export default class LearnMoreButton extends Component {
    learnMoreUrl = learnMoreUrl;
}
