# fluxstore[![Build Status](https://secure.travis-ci.org/pwlmaciejewski/fluxstore.png?branch=master)](http://travis-ci.org/pwlmaciejewski/fluxstore)

Yet another [http://facebook.github.io/flux/](Flux) store for both client- and server-side.

## Installation

### Node.js

```
npm install fluxstore
```

### Bower
```
bower install fluxstore
```

## Usage

```javascript
var FluxStore = require('fluxstore'); // Node.js. For browser script tag: include file from the dist/ folder.

// Init FluxStore with the dispatcher. It returns Store constructor.
var dispatcher = new require('flux').Dispatcher();
var Store = FluxStore(dispatcher);

// Create a new store with optional initial state
var store = new Store({
  foo: 'bar'
});

// Add a reducer. Reducer is a function that will be invoked on specified action.
// It's always invoked with the current state of the store and the action that triggered it.
// If you return a non-falsy value from the reducer it will be treated as a new state.
// This will cause in state change and triggering a change event.
store.reducer('FOO', function(state, action) {
  console.log(state); // { foo: 'bar' }
  console.log(action); // { actionName: 'FOO', foo: 'baz' }
  state.foo = action.foo;
  return state;
});

// Listen for change event
store.bind('change', onChange);

function onChange() {
  alert('Change!');
};

// To trigger the reducer invoke dispatch with actionName matching reducer's name
dispatcher.dispatch({
  actionName: 'FOO',
  foo: 'baz'
});

// Stop listening for changes
store.unbind('change', onChange);

```

More info in [API Docs](./docs/index.md).
