import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface CustomRequestType extends Request {
    [key: string]: any
}

const veriyfJwt = (req: CustomRequestType, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || <string>req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({message: 'Unauthorized'})

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        `${process.env.ACCESS_TOKEN_SECRET}`,
        (err, decoded: any) => {
            if (err) res.status(403).json({message: 'Forbidden'})
            req.user = decoded.userInfo.username
            req.roles = decoded.userInfo.role
            next()
        }
    )
}

export default veriyfJwt