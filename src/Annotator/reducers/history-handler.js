// @flow

import type { MainLayoutState, Action } from "../../MainLayout/types"
import { setIn, updateIn, asMutable, without } from "seamless-immutable"
import moment from "moment"

const typesToSaveWithHistory = {
  BEGIN_BOX_TRANSFORM: "Transform/Move Box",
  BEGIN_MOVE_POINT: "Move Point",
  DELETE_REGION: "Delete Region",
}

export const saveToHistory = (state: MainLayoutState, name: string) => {
  const nextState = updateIn(state, ["history"], (h) =>
    [
      {
        time: moment().toDate(),
        state: without(state, "history"),
        name,
      },
    ].concat((h || []).slice(0, 9))
  );
  return nextState;
}

export default (reducer) => {
  return (state: MainLayoutState, action: Action) => {
    const prevState = state
    let nextState = reducer(state, action);
    
    if (action.type === "RESTORE_HISTORY") {
      if (state.history.length > 0) {
        nextState = setIn(
          nextState.history[0].state,
          ["history"],
          nextState.history.slice(1)
        );
        if (typeof state.onChange === 'function') {
          state.onChange(nextState); // RFAVAS
        }
        return nextState;
      }
    } else {
      if (prevState !== nextState && Object.keys(typesToSaveWithHistory).includes(action.type)) {
        nextState = setIn(
          nextState,
          ["history"],
          [
            {
              time: moment().toDate(),
              state: without(prevState, "history"),
              name: typesToSaveWithHistory[action.type] || action.type,
            },
          ]
            .concat(nextState.history || [])
            .slice(0, 9)
        )
        return nextState;
      }
    }
    return nextState
  }
}
