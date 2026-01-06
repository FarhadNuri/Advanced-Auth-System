// b4f45014e96be88ada93e8891455b044
// 9dc5fc9b1ae65f2eee0c03cc85a3cc86

import {MailtrapClient} from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.MAILTRAP_API_TOKEN;

export const client = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};
