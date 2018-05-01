import Controller from '@ember/controller';
import EngineInstance from '@ember/engine/instance';
import podNames from 'ember-component-css/pod-names';

export function initialize(engineInstance: EngineInstance) {
    const Router = engineInstance.lookup('router:main');

    Router.reopen({
        didTransition(infos: any[]) {
            this._super(infos);

            const classes = new Set<string>();

            for (const info of infos) {
                // TODO: Generically fix the pod-names for engines
                const routeName = info.name.replace(/^collections\.?/, '') || 'index';
                const currentPath = routeName.replace(/\./g, '/').replace(/\/index/, '');
                const podName = podNames[currentPath];

                if (podName) {
                    const controller: Controller = engineInstance.lookup(`controller:${routeName}`);

                    if (controller) {
                        (controller as any).set('styleNamespace', podName);
                    }

                    classes.add(podName);
                }
            }

            engineInstance.lookup('controller:application').set('routeStyleNamespaceClassSet', [...classes].join(' '));
        },
    });
}

export default {
    name: 'routeStyles',
    initialize,
};
