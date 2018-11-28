const DEFAULT_STATE = {
  adding: false,
  done: false
}

export default function(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case "esi.addCharacter_PENDING": {
      return {...state, adding: true, done: false}
    }

    case "esi.addCharacter_FULFILLED": {
      return {...state, adding: false, done: true}
    }

    default: {
      return state
    }
  }
}