import fs from "fs"
import path from "path"
import multer from "multer"
import config from "config"
import { Router } from "express"

import { type Request, type Response } from "express"

import prisma from "../db/client"
import validateToken from "../middlewares/validateToken"
import { getSafeFileName } from "../utils"

const router = Router()

type SingleFileBody = {
  folder?: string
  filename?: string
}

router.post(
  "/single",
  validateToken,
  multer().any(),
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[]
    const body: SingleFileBody = { ...req.body }
    const image = files[0]

    const fileName = body.filename
      ? getSafeFileName(body.filename)
      : Date.now().toString()

    const extension = path.extname(image.originalname)
    const destination = path.join(
      process.cwd(),
      config.get("upload_root"),
      body.folder || "default"
    )

    if (!fs.existsSync(destination)) fs.mkdirSync(destination)

    const final_destination = path.join(destination, fileName + extension)
    fs.writeFileSync(final_destination, image.buffer)

    await prisma.image.create({
      data: {
        folder: body.folder || "default",
        filename: fileName,
        extension,
        filesize: image.size,
      },
    })

    res.json({
      success: true,
      image_url: `${config.get('base_url')}/${fileName}`,
      delete_url: `${config.get('base_url')}/delete/${fileName}`,
    })
  }
)

export default router
