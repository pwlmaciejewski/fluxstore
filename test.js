var assert = require('chai').assert;
var sinon = require('sinon');
var Flux = require('flux');
var dispatcher = new Flux.Dispatcher();
var Store = require('./index.js')(dispatcher);

describe('FluxStore', function() {

  it('Creates an empty store', function() {
    var store = new Store();
    assert.deepEqual(store.getState(), {});
  });

  it('getState() returns a copy of state', function() {
    var store = new Store();
    store.setState({
      arr: []
    });
    var state1 = store.getState();
    var state2 = store.getState();
    assert.notEqual(state1.arr, state2.arr);
  });

  it('getInitialState() returns an initial state', function() {
    var store = new Store({
      foo: 'bar'
    });
    store.setState({
      foo: 'baz'
    });
    assert.equal(store.getState().foo, 'baz');
    assert.equal(store.getInitialState().foo, 'bar');
  });

  it('reset() sets the initial state', function() {
    var store = new Store({
      foo: 'bar'
    });
    store.setState({
      foo: 'baz'
    });
    store.reset();
    assert.equal(store.getState().foo, 'bar');
  });

  it('getToken() returns dispatcher token', function() {
    var Store = require('./index')({
      register: function() {
        return 'foo';
      }
    });
    var store = new Store();
    assert.equal(store.getToken(), 'foo');
  });

  describe('reducer()', function() {
    beforeEach(function() {
      this.store = new Store({
        foo: 'bar',
        aaa: 'bbb'
      });
      this.spy = sinon.spy(function(state, action) {
        state.foo = action.foo;
        return state;
      });
      this.store.reducer('FOO', this.spy);
      dispatcher.dispatch({
        _name: 'FOO',
        foo: 'baz'
      });
    });

    it('Calls the reducer on specific action', function() {
      assert.ok(this.spy.calledOnce);
    });

    it('Called with current state as a first arg', function() {
      var state = this.spy.getCall(0).args[0];
      assert.equal(state.aaa, 'bbb');
    });

    it('Called with action as a second arg', function() {
      var action = this.spy.getCall(0).args[1];
      assert.equal(action._name, 'FOO');
    });

    it('Changes the state when returned from reducer', function() {
      assert.equal(this.store.getState().foo, 'baz');
    });

    it('Does not change state when falsy value returned', function() {
      var spy = sinon.spy(function(state) {
        state.aaa = 'xxx';
        return false;
      });
      this.store.reducer('AAA', spy);
      dispatcher.dispatch({
        actionName: 'AAA'
      });
      assert.ok(spy.calledOnce);
      assert.equal(this.store.getState().aaa, 'bbb');
    });

  });

  it('method() add a instence method', function() {
    var store = new Store({
      foo: 'bar'
    });

    store.method('getFoo', function() {
      return this.getState().foo;
    });

    assert.equal(store.getFoo(), 'bar');
  });

  describe('Store.create() creates the store in "one go"', function() {
    beforeEach(function() {
      this.store = Store.create({
        foo: 'bar'
      }, {
        'FOO': function(state) {
          state.foo = 'baz';
          return state;
        }
      }, {
        getFoo: function() {
          return this.getState().foo;
        }
      });
    });

    it('Has correct initial state', function() {
      assert.equal(this.store.getState().foo, 'bar');
    });

    it('Has correct reducers', function() {
      dispatcher.dispatch({
        actionName: 'FOO'
      });
      assert.equal(this.store.getState().foo, 'baz');
    });

    it('Has correct methods', function() {
      assert.equal(this.store.getFoo(), 'bar');
    });
  });

});
