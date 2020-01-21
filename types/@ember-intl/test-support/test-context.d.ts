import IntlService from 'ember-intl/services/intl';
import { TestContext as BaseTextContext } from 'ember-test-helpers';

export default interface TestContext extends BaseTextContext {
    intl: IntlService;
} // eslint-disable-line semi
