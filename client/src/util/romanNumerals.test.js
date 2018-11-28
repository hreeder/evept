import { getRomanNumeral } from './romanNumerals'

it('returns correctly for 0', () => {
  expect(getRomanNumeral(0)).toEqual("0")
})

it('returns correctly', () => {
  expect(getRomanNumeral(1)).toEqual("I")
  expect(getRomanNumeral(2)).toEqual("II")
  expect(getRomanNumeral(3)).toEqual("III")
  expect(getRomanNumeral(4)).toEqual("IV")
  expect(getRomanNumeral(5)).toEqual("V")
})

it('returns NaN when given an incorrect value', () => {
  expect(getRomanNumeral(6)).toEqual("NaN")
})