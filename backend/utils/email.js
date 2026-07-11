import nodemailer from "nodemailer"
import pug from "pug"
import { convert } from "html-to-text"

export default class Email {
  constructor(user, url) {
    console.log(process.env.EMAIL_HOST)
    this.to = user.email
    this.firstName = user.name.split(" ")[0]
    this.url = url
    this.from = `OrderIt <${process.env.EMAIL_FROM}>`
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  async send(template, subject) {
    const html = pug.renderFile(`${process.cwd()}/view/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    })

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    }

    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send("welcome", "welcome to the Order It!")
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "password reset token (valid for only 10 minutes)"
    )
  }
}