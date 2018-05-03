import Application from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import { run } from '@ember/runloop';

export default function destroyApp(application: Application | ApplicationInstance) {
    run(application, 'destroy');
}
