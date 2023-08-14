import { setIn, updateIn, asMutable, without } from "seamless-immutable";
import moment from "moment";
var typesToSaveWithHistory = {
  BEGIN_BOX_TRANSFORM: "Transform/Move Box",
  BEGIN_MOVE_POINT: "Move Point",
  DELETE_REGION: "Delete Region"
};
export var saveToHistory = function saveToHistory(state, name) {
  var nextState = updateIn(state, ["history"], function (h) {
    return [{
      time: moment().toDate(),
      state: without(state, "history"),
      name: name
    }].concat((h || []).slice(0, 9));
  });
  return nextState;
};
export default (function (reducer) {
  return function (state, action) {
    var prevState = state;
    var nextState = reducer(state, action);
    if (action.type === "RESTORE_HISTORY") {
      if (state.history.length > 0) {
        nextState = setIn(nextState.history[0].state, ["history"], nextState.history.slice(1));
        state.onChange(nextState); // RFAVAS
        return nextState;
      }
    } else {
      if (prevState !== nextState && Object.keys(typesToSaveWithHistory).includes(action.type)) {
        nextState = setIn(nextState, ["history"], [{
          time: moment().toDate(),
          state: without(prevState, "history"),
          name: typesToSaveWithHistory[action.type] || action.type
        }].concat(nextState.history || []).slice(0, 9));
        return nextState;
      }
    }
    return nextState;
  };
});