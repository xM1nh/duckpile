import pool from '../config/dbConfig'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import * as auth_queries from './authQueries'

export const login = asyncHandler(async (req, res, next) => {
    const { username, password} = req.body  
    if (!username || !password) {
        res.status(400).json({message: 'All fields are required'})
    }

    const found = await pool.query(auth_queries.findOne, [username])
    const foundUser = found.rows[0]

    if (!foundUser) res.status(401).json({message: 'Unauthorized'})

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) res.status(401).json({message: 'Unauthorized'})

    const accessToken = jwt.sign(
        {
            userInfo: {
                username: foundUser.username,
                role: foundUser.role
            }
        },
        `${process.env.ACCESS_TOKEN_SECRET}`,
        {expiresIn: '10s'}
    )

    const refreshToken = jwt.sign(
        {username: foundUser.username},
        `${process.env.REFRESH_TOKEN_SECRET}`,
        {expiresIn: '12h'}
    )

    //Create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: false,
        maxAge: 12 * 60 * 60 * 1000
    })

    //Send access token containing username and role
    res.json({accessToken})
})

export const refresh = (req: Request, res: Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) res.status(401).json({message: 'Unauthorized'})
    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        `${process.env.REFRESH_TOKEN_SECRET}`,
        async (err: VerifyErrors | null, decoded: any) => {
            try {
                if (err) res.status(403).json({message: 'Forbidden'})

                const found = await pool.query(auth_queries.findOne, [decoded.username])
                const foundUser = found.rows[0]

                if (!foundUser) res.status(401).json({message: 'Unauthorized'})

                const accessToken = jwt.sign(
                    {
                        userInfo: {
                            username: foundUser.username,
                            role: foundUser.role
                        }
                    },
                    `${process.env.ACCESS_TOKEN_SECRET}`,
                    {expiresIn: '10s'}
                )
            } catch (err) {
                res.status(500).json({message: err})
            }
        })
}

export const logout = (req: Request, res: Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) res.sendStatus(204)
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: false,
        maxAge: 12 * 60 * 60 * 1000
    })
    res.json({message: 'Cookie cleared'})
}