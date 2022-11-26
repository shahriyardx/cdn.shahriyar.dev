import { type Request, type Response } from "express"

const validateToken = (req: Request, res: Response, next: () => void) => {
  const token = process.env.TOKEN
  const auth = req.headers.authorization

  if (token !== auth)
    return res.status(403).json({ success: false, message: "Unauthorized " })

  next()
}

export default validateToken