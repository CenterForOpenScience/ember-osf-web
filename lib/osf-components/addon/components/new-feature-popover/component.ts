import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Cookies from 'ember-cookies/services/cookies';
import moment from 'moment';
import { tracked } from 'tracked-built-ins';

interface Args {
    triggerElement: string;
    featureCookie: string;
}

export default class NewFeaturePopover extends Component<Args> {
    @service cookies!: Cookies;
    @tracked notAgain = false;

    @action
    onAccept() {
        if (this.notAgain) {
            this.cookies.write(this.args.featureCookie, 1, {
                expires: moment().add(10, 'years').toDate(),
                path: '/',
            });
        }
    }

}
