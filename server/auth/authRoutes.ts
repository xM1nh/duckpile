import express from 'express'
import loginLimiter from "../middleware/loginLimiter";
import * as auth_controller from './authController'

const router = express.Router()

//Login
router.post('/', loginLimiter, auth_controller.login)

//Refresh
router.get('/refresh', auth_controller.refresh)

//Logout
router.post('/logout', auth_controller.logout)