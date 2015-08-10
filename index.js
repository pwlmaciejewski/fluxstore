/**
 * FluxStore
 * @overview Yet another flux store
 * @author Paweł Maciejewski <fragphace@gmail.com>
 */

var MicroEvent = require('microevent');
var clone = require('clone');

function init(dispatcher) {
  /**
  * Constructor
  * @constructor
  * @param {Object} initialState - (optional) Store's initial state
  */
  function Store(initialState) {
    initialState = initialState || {};
    this.dispatcher = dispatcher;
    this.initialState = Store.deepCopy(initialState);
    this.state = Store.deepCopy(initialState);
    this.token = dispatcher.register(this.onAction.bind(this));
    this.reducers = {};
  }

  Store.prototype.onAction = function(action) {
    var reducer = this.reducers[action.actionName || action._name];
    if (!reducer) return;
    var newState = reducer.call(this, this.getState(), action);
    if (!newState) return;
    this.setState(newState);
    this.trigger('change');
  };

  /**
  * setState
  * @description Set current state.
  * @param {Object} state - new state.
  * @example new Store().setState({ foo: 'bar' }).getState().foo // 'bar'
  */
  Store.prototype.setState = function(state) {
    this.state = Store.deepCopy(state);
  };

  /**
  * setState
  * @description Returns a deep copy of the current state.
  * @example new Store({ foo: 'bar' }).getState().foo // 'bar'
  */
  Store.prototype.getState = function() {
    return Store.deepCopy(this.state);
  };

  /**
  * getToken
  * @description Returns a dispatcher token - used in `dispatcher.waitFor`.
  */
  Store.prototype.getToken = function() {
    return this.token;
  };

  Store.deepCopy = function(obj) {
    return clone(obj);
  };

  /**
  * getInitialState
  * @description Returns an initial state of the store.
  */
  Store.prototype.getInitialState = function() {
    return this.initialState;
  };

  /**
  * reset
  * @description Resets the store to the initial state.
  */
  Store.prototype.reset = function() {
    this.setState(this.getInitialState());
  };

  /**
  * reducer
  * @param {String} actionName - Action that will trigger the reducer.
  * @param {Function} reducer - Reducer function.
  * @description Adds a reducer function. Reducer is a function that will be invoked on specified action.
  * It's always invoked with the current state of the store and the action that triggered it.
  * If you return a non-falsy value from the reducer it will be treated as a new state.
  * This will cause in state change and triggering a change event.
  */
  Store.prototype.reducer = function(actionName, reducer) {
    this.reducers[actionName] = reducer;
  };

  /**
  * method
  * @param {String} key - Method name
  * @param {Function} fn - Function.
  * @description Adds a instance method to the store.
  */
  Store.prototype.method = function(key, fn) {
    this[key] = fn;
  };

  MicroEvent.mixin(Store);

  /**
  * Store.create
  * @param {Object} initialState - Initial state of the store
  * @param {Object} reducers - Object with reducers.
  * @param {Object} methods - Object with instance methods.
  * @description Helper method to create a new store with initial state, reducers
  * and instance methods with one call.
  */
  Store.create = function (initialState, reducers, methods) {
    var store = new Store(initialState);

    for (var key in reducers) {
      if (reducers.hasOwnProperty(key)) {
        store.reducer(key, reducers[key]);
      }
    }

    for (key in methods) {
      if (methods.hasOwnProperty(key)) {
        store.method(key, methods[key]);
      }
    }

    return store;
  };

  return Store;
}

module.exports = init;
