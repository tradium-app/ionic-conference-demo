export function combineReducers(reducers) {
  // type keys = keyof typeof reducers;
  // type returnType = { [K in keys]: ReturnType<typeof reducers[K]> };
  const combinedReducer = (state, action) => {
    const newState = {};
    const keys = Object.keys(reducers);
    keys.forEach((key) => {
      const result = reducers[key](state[key], action);
      newState[key] = result || state[key];
    });
    return newState;
  };
  return combinedReducer;
}
