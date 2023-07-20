import { CorsOptions } from "cors"

const allowedOrigins = [
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
]

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

export default corsOptions