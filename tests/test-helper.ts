import { setResolver } from '@ember/test-helpers';
import { start } from 'ember-cli-qunit';
import resolver from './helpers/resolver';

setResolver(resolver);
start();
