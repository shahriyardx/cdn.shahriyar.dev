import Express from "express"
import Config from "config"
import dotenv from "dotenv"

dotenv.config()

// Routers
import uploadRouter from "./routers/upload"
import viewerRouter from "./routers/viewer"
import deleteRouter from "./routers/delete"

const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

const port = Config.get("port") as number
const host = Config.get("host") as string

// Using Routers
app.use("/", viewerRouter)
app.use("/delete", deleteRouter)
app.use("/upload", uploadRouter)

app.listen(port, host, () => {
  console.log(`Running on http://${host}:${port}`)
})
