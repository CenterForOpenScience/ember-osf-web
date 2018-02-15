import $ from 'jquery';
import Controller from '@ember/controller';
import config from 'ember-get-config';
import pathJoin from 'ember-osf/utils/path-join';
import OSFAgnosticAuthControllerMixin from 'ember-osf-web/mixins/osf-agnostic-auth-controller';

export default Controller.extend(OSFAgnosticAuthControllerMixin, {
    signupUrl: `${pathJoin(config.OSF.url, 'register')}?${$.param({ next: window.location.href })}`,
});
