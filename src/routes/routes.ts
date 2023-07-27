import { Router } from "express";
import cors from "cors";
import { sendPuzzleMsg } from "../utils/sendPuzzleMsg";
import { sendServerMessage } from "../utils/sendServerStatus";

const routes = Router();

routes.use(cors());

routes.post("/puzzle", (req, res) => {
  const { message } = req.body;
  sendPuzzleMsg(message);
  res.send("ok");
});
routes.post("/sendMessage", (req, res) => {
  const { channelId, message } = req.body;
  sendServerMessage(channelId, message);
  res.send("ok");
});

export default routes;
