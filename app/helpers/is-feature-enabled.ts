import { helper } from '@ember/component/helper';
import Features from 'ember-feature-flags/services/features';

export function isFeatureEnabled([features, flagName]: [Features, string]): boolean {
    return features.isEnabled(flagName);
}

export default helper(isFeatureEnabled);
