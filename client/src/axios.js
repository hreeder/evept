import axiosPkg from 'axios'

export default function() {
  return axiosPkg.create({
    baseURL: process.env.REACT_APP_API_ROOT,
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('auth0')).accessToken}`
    }
  })
}