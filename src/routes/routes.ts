import { Router } from "express";
import cors from "cors";
import { sendPuzzleMsg } from "..";

const routes = Router();

routes.use(cors());

routes.get("/puzzle", (req, res) => {
  console.log("request");
  sendPuzzleMsg();
  res.send("ok");
});

export default routes;
