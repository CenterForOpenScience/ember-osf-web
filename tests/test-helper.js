import { setResolver } from 'ember-qunit';
import resolver from './helpers/resolver';
import { start } from 'ember-cli-qunit';

setResolver(resolver);
start();
