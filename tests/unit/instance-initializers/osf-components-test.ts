import Application from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import { run } from '@ember/runloop';
import Service from '@ember/service';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { initialize } from 'osf-components/instance-initializers/osf-components';

const LOCALES = ['en', 'ja', 'zh'];

class I18NStub extends Service {
    translations: { [k: string]: object } = {};

    addTranslations(locale: string, translations: object) {
        this.translations[locale] = translations;
    }
}

interface Context extends TestContext {
    TestApplication: any;
    application: Application;
    instance: ApplicationInstance;
}

module('Unit | Instance Initializer | osf-components', hooks => {
    hooks.beforeEach(function(this: Context) {
        this.TestApplication = Application.extend();
        this.TestApplication.instanceInitializer({
            name: 'initializer under test',
            initialize,
        });

        this.application = this.TestApplication.create({ autoboot: false });
        this.application.register('service:i18n', I18NStub);

        this.instance = this.application.buildInstance();
    });

    hooks.afterEach(function(this: Context) {
        run(this.application, 'destroy');
        run(this.instance, 'destroy');
    });

    test('osf-components translations are loaded', async function(this: Context, assert) {
        await this.instance.boot();
        const { translations } = this.instance.lookup('service:i18n');
        LOCALES.forEach(locale => {
            assert.ok(
                locale in translations,
                `Translations have been added for locale: ${locale}`,
            );
            assert.ok(
                locale in translations && 'osf-components' in translations[locale],
                `Locale '${locale}' includes translations for osf-components`,
            );
        });
    });
});
