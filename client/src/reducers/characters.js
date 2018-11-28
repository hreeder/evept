import Character from '../models/character'

const DEFAULT_STATE = {
  characters: [],
  updated_at: new Date(2018, 0, 1, 10, 0, 0),
  loading: false,
  loaded: false,
  viewPreferences: {
    expandQueue: true
  }
}

export default function(state=DEFAULT_STATE, action) {
  switch(action.type) {
    case "characters.getCharacters_PENDING": {
      return {...state, loading: true}
    }

    case "characters.getCharacters_FULFILLED": {
      let characters = []
      action.payload.characters.forEach(characterJSON => {
        const character = new Character().fromJSON(characterJSON)
        characters.push(character)
      })
      return {...state, characters: characters, updated_at: Date.now(), loading: false, loaded: true}
    }

    case "characters.toggleQueue": {
      return {...state, viewPreferences: {...state.viewPreferences, expandQueue: !state.viewPreferences.expandQueue}}
    }

    default: {
      return state
    }
  }
}