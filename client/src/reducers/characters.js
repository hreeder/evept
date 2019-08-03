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

export default function (state = DEFAULT_STATE, action) {
  switch (action.type) {
    case "characters.getCharacters_PENDING": {
      return { ...state, loading: true }
    }

    case "characters.getCharacters_FULFILLED": {
      let characters = []
      action.payload.data.characters.forEach(characterJSON => {
        const character = new Character().fromJSON(characterJSON)
        characters.push(character)
      })
      return { ...state, characters: characters, updated_at: Date.now(), loading: false, loaded: true }
    }

    case "characters.toggleQueue": {
      return { ...state, viewPreferences: { ...state.viewPreferences, expandQueue: !state.viewPreferences.expandQueue } }
    }

    case "characters.getCharacterSkills_FULFILLED": {
      let characters = [...state.characters]
      const target = characters.filter((it) => it.characterId === parseInt(action.payload.data.characterId, 10))[0]
      characters.splice(characters.indexOf(target), 1)
      target.skills = action.payload.data.skills
      target.skillsLoaded = true
      return { ...state, characters: [...characters, target] }
    }

    case "characters.getCharacterSkillqueue_FULFILLED": {
      let characters = [...state.characters]
      const target = characters.filter((it) => it.characterId === parseInt(action.payload.data.characterId, 10))[0]
      characters.splice(characters.indexOf(target), 1)
      target.skillqueue = action.payload.data.skillqueue
      target.skillqueueLoaded = true
      return { ...state, characters: [...characters, target] }
    }

    default: {
      return state
    }
  }
}