import fs from "fs"
import path from "path"
import config from "config"
import { Router } from "express"

import prisma from "../db/client"

import { type Request, type Response } from "express"
import validateToken from "../middlewares/validateToken"

const router = Router()

router.delete("/:image", validateToken, async (req: Request, res: Response) => {
  let f_name = req.params.image
  f_name = f_name.includes(".") ? f_name.split(".")[0] : f_name

  const data = await prisma.image.findUnique({
    where: {
      filename: f_name,
    },
  })

  if (data) {
    const file_path = path.join(
      process.cwd(),
      config.get("upload_root"),
      data.folder,
      data.filename + data.extension
    )

    if (fs.existsSync(file_path)) fs.rmSync(file_path)
    await prisma.image.delete({ where: { id: data.id } })

    res.json({ message: "file deleted" })
  } else {
    res.status(404).json({ message: "file not found" })
  }
})

export default router
