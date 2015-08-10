# Global





* * *

## Class: Store
Constructor

### Store.setState(state) 

Set current state.

**Parameters**

**state**: `Object`, new state.


**Example**:
```js
new Store().setState({ foo: 'bar' }).getState().foo // 'bar'
```

### Store.getState() 

Returns a deep copy of the current state.


**Example**:
```js
new Store({ foo: 'bar' }).getState().foo // 'bar'
```

### Store.getToken() 

Returns a dispatcher token - used in `dispatcher.waitFor`.


### Store.getInitialState() 

Returns an initial state of the store.


### Store.reset() 

Resets the store to the initial state.


### Store.reducer(actionName, reducer) 

Adds a reducer function. Reducer is a function that will be invoked on specified action.
It's always invoked with the current state of the store and the action that triggered it.
If you return a non-falsy value from the reducer it will be treated as a new state.
This will cause in state change and triggering a change event.

**Parameters**

**actionName**: `String`, Action that will trigger the reducer.

**reducer**: `function`, Reducer function.


### Store.method(key, fn) 

Adds a instance method to the store.

**Parameters**

**key**: `String`, Method name

**fn**: `function`, Function.


### Store.create(initialState, reducers, methods) 

Helper method to create a new store with initial state, reducers
and instance methods with one call.

**Parameters**

**initialState**: `Object`, Initial state of the store

**reducers**: `Object`, Object with reducers.

**methods**: `Object`, Object with instance methods.




* * *



**Author:** Paweł Maciejewski &lt;fragphace@gmail.com&gt;



**Overview:** Yet another flux store


