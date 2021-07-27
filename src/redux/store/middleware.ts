export const loggerMiddleware = storeAPI => next => action => {
  console.trace('dispatching', action)
  let result = next(action)
  console.trace('next state', storeAPI.getState())
  return result
}