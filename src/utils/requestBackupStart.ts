import axios from "axios";

const serverManagerUrl = process.env.SERVER_MANAGER_URL as string;
const serverManagerToken = process.env.SERVER_MANAGER_TOKEN as string;

var config = {
  method: "GET",
  url: serverManagerUrl + "/startBackup",
  headers: {
    authorization: "Basic " + serverManagerToken,
  },
};

export async function requestBackupStart() {
  try {
    const response = await axios(config);
    return { data: response.data, sucess: true };
  } catch (err) {
    return { err, sucess: false };
  }
}
