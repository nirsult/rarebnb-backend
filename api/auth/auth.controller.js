import { authService } from './auth.service.js'
import { logger } from '../../services/logger.service.js'

export async function login(req, res) {
  const { username, password } = req.body
  try {
    const user = await authService.login(username, password)
    const loginToken = authService.getLoginToken(user)

    logger.info('User login: ', user)

    res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
    res.json(user)
  } catch (err) {
    logger.error('Failed to Login ' + err)
    res.status(400).send({ err: 'Failed to Login' })
  }
}

export async function signup(req, res) {
  const {
    fullname,
    username,
    password,
    imgUrl = "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747478520/user_yb3tnn.png"
  } = req.body

  const credentials = { fullname, username, password, imgUrl }

  // Never log passwords
  // logger.debug(credentials)

  try {
    const account = await authService.signup(credentials)
    logger.debug(`auth.route - new account created: ` + JSON.stringify(account))

    const user = await authService.login(credentials.username, credentials.password)
    logger.info('User signup:', user)

    const loginToken = authService.getLoginToken(user)
    res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
    res.json(user)
  } catch (err) {
    logger.error('Failed to signup ' + err)
    res.status(400).send({ err: 'Failed to signup' })
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie('loginToken')
    res.send({ msg: 'Logged out successfully' })
  } catch (err) {
    res.status(400).send({ err: 'Failed to logout' })
  }
}