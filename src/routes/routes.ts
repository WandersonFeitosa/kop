import { Router } from "express";
import cors from "cors";
import { sendPuzzleMsg } from "..";

const routes = Router();

routes.use(cors());

routes.post("/puzzle", (req, res) => {
  const { message } = req.body;
  sendPuzzleMsg(message);
  res.send("ok");
});

export default routes;
