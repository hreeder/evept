export function getRomanNumeral(value) {
  switch (value) {
    case 0: {
      return "0"
    }
    case 1: {
      return "I"
    }
    case 2: {
      return "II"
    }
    case 3: {
      return "III"
    }
    case 4: {
      return "IV"
    }
    case 5: {
      return "V"
    }
    default: {
      return 'NaN'
    }
  }
}