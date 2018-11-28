const DEFAULT_STATE = {
  user: null,
  login: {
    pending: false,
    fail: false,
    fail_reason: "",
    fail_message: ""
  }
}


export default function(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case "auth.login_PENDING": {
      return {...state, login: {
        ...state.login,
        pending: true
      }}
    }

    case "auth.login_REJECTED": {
      return {...state, login: {
        ...state.login,
        pending: false,
        fail: true,
        fail_reason: action.payload.code,
        fail_message: action.payload.message
      }}
    }

    case "auth.login_FULFILLED": {
      return {...state, login: {
        ...state.login,
        pending: false,
        fail: false
      }}
    }

    case "auth.getLoggedInUser_PENDING": {
      return state
    }

    case "auth.getLoggedInUser_REJECTED": {
      if (action.payload === "not authenticated") {
        return {...state, user: null}
      }
      return state
    }
  
    case "auth.getLoggedInUser_FULFILLED": {
      return {...state, user: action.payload}
    }

    default: {
      return state
    }
  }
}