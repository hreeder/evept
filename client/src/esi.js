const AUTH_URI = "https://login.eveonline.com/v2/oauth/authorize"
const REDIRECT_URI = `${process.env.REACT_APP_ROOT_PATH}/esi/callback`           // This is registered at https://developers.eveonline.com
const CLIENT_ID = process.env.REACT_APP_ESI_CLIENTID
const SCOPES = [
  "esi-skills.read_skills.v1",
  "esi-skills.read_skillqueue.v1"
]


// https://login.eveonline.com/v2/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5515%2Fcallback&client_id=8960fbe30a074890a186351a4f1479a0&scope=esi-assets.read_assets.v1+esi-assets.read_corporation_assets.v1&state=nothing
// URI
//  ->
//    response_type: code
//    redirect_uri:  $REDIRECT_URI
//    client_id:     $CLIENT_ID
//    scope:         $SCOPES.join('+')
//    state:         nothing

function getAuthURI() {
  let redirect = encodeURI(REDIRECT_URI)
  let scopes = SCOPES.join("+")
  return `${AUTH_URI}?response_type=code&redirect_uri=${redirect}&client_id=${CLIENT_ID}&scope=${scopes}&state=nothing`
}

export { getAuthURI }