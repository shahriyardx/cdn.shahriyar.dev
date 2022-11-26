import fs from "fs"
import path from "path"
import stream from "stream"
import config from "config"
import { Router } from "express"

import prisma from "../db/client"

import { type Request, type Response } from "express"

const router = Router()

const getFiles = async (folder_name?: string) => {
  let data = []
  if (folder_name) {
    data = await prisma.image.findMany({
      where: {
        folder: folder_name,
      },
    })
  } else {
    data = await prisma.image.findMany()
  }

  const response = data.map((image) => ({
    ...image,
    image_url: `${config.get("base_url")}/${image.filename}`,
    delete_url: `${config.get("base_url")}/delete/${image.filename}`,
  }))

  return {success: true, files: response}
}

router.get("/", (req: Request, res: Response) => {
  res.json({ working: true })
})

router.get("/files", async (req: Request, res: Response) => {
  res.json(await getFiles())
})

router.get("/files/:folderName", async (req: Request, res: Response) => {
  const folder_name = req.params.folderName
  res.json(await getFiles(folder_name))
})

router.get("/:image", async (req: Request, res: Response) => {
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
    const s = fs.createReadStream(file_path)
    const ps = new stream.PassThrough()

    stream.pipeline(s, ps, () => {
      return res.status(500)
    })

    ps.pipe(res)
  } else {
    res.status(404).json({ message: "file not found" })
  }
})

export default router
