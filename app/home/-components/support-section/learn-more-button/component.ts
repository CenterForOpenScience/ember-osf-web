import Component from '@ember/component';

import config from 'ember-get-config';

const {
    OSF: {
        learnMoreUrl,
    },
} = config;

export default class LearnMoreButton extends Component {
    learnMoreUrl: string = learnMoreUrl;
}
