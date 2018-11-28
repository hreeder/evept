const DEFAULT_STATE = {
  loadingTypeIDs: false,
  loadingGroupIds: false,
  typeIDs: null,
  groupIDs: null
}

export default function(state=DEFAULT_STATE, action) {
  switch(action.type) {
    case "sde.getTypeIDs_PENDING": {
      return {...state, loadingTypeIDs: true}
    }

    case "sde.getTypeIDs_REJECTED": {
      return state
    }

    case "sde.getTypeIDs_FULFILLED": {
      return {...state, typeIDs: action.payload.data, loadingTypeIDs: false}
    }

    case "sde.getGroupIDs_PENDING": {
      return {...state, loadingGroupIds: true}
    }

    case "sde.getGroupIDs_REJECTED": {
      return state
    }

    case "sde.getGroupIDs_FULFILLED": {
      return {...state, groupIDs: action.payload.data, loadingGroupIds: false}
    }

    default: {
      return state
    }
  }
}