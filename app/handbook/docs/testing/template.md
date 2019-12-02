# Testing

## Test categories

### By what they try to determine
We organize the tests in the hierarchy by this set of categories.

#### Acceptance test
These are a type of Application test (see below) that looks at the behavior of the whole app from a user's perspective. Ideally, when adding a new page, the Acceptance tests should be the first thing you write after you get all of the appropriate information from Product and preferably after consulting with QA. The handy thing about acceptance tests is that it's behavior driven, so it shouldn't matter what the underlying implementation of the models or the components are. If the OSF API is defined, you should be able to define what the test selectors are and how they react to various situations, then fill in the functionality of everything else to make those tests pass.

See [ember-test-selectors](https://ember-test-selectors.com) for a good introduction to test selectors and why they are great.

If your Acceptance test isn't robust enough to survive a refactor of the ember-osf-web application (to typescript, to a new version of Ember, to engines, or whatever), then it's probably not been designed right. Good tests here will eliminate a lot of testing that QA would have to otherwise do.

You will make heavy use of [Mirage](http://www.ember-cli-mirage.com) for these tests.

#### Unit test
They are tests that look at behavior of a single thing and are mostly used for services, utils, serializers, and controller actions. They are very useful for verifying interfaces of logic that need to be consistent regardless of how it will ultimately be used. Consequently, they are super handy if you know that your code will one day need to act a certain way, but nothing uses that functionality just yet, that you can be assured that it will be ready when the day arrives. Unit tests should be reasonably quick to create and fast to run, so completeness is often desirable in a unit test. Try to get all of the edge cases here rather than, say, in the Acceptance tests.

#### Integration test
These look at interactions of multiple components (or other code encapsulations like a service and a component). They could be application tests or rendering tests for components. It is less clear when to use Integration tests vs. Acceptance or Unit tests except in the case of rendering tests (see below) for components. A lot of the existing integration tests for components in our codebase are the most basic of tests and are hardly modified from the blueprint. If there are things that will change how the component renders, we should ensure that those aspects are tested here.

### By what needs to run
This is the new classification of tests from Ember, but it doesn't really affect how the tests are named or organized. It does affect how the tests are instantiated, though.

#### Application test
Any test that needs the whole app booted.

#### Rendering test
Any test that requires rendering.

#### Unit test
Any test that uses nothing other than the class/function/object it's testing.

