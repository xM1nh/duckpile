import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const folderName = req.params.productID
        const destination = `./uploads/${folderName}`

        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, {recursive: true})
        }
        cb(null, destination)
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() +  path.extname(file.originalname))
    }
})

export const uploadMulti = multer({ storage: storage })

