import { run } from '@ember/runloop';
import config from 'ember-get-config';
import Application from 'ember-osf-web/app';

export default function startApp(attrs = {}) {
    let application;

    const attributes = {
        ...config.APP,
        ...attrs,
    };

    run(() => {
        application = Application.create(attributes);
        application.setupForTesting();
        application.injectTestHelpers();
    });

    return application;
}
