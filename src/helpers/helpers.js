import fetch from "sync-fetch";
import nodemailer from "nodemailer";

/**
 * Envio de email
 */
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "1luisfelipe2@gmail.com",
    pass: "svasnnrczwxpnswc",
  },
});

/**
 * Envio de email
 * @params {Object} mailOptions
 */
export function sendEmail(options) {
  const mailOptions = {
    from: "1luisfelipe2@gmail.com", // sender address
    to: "luisoisoiso@gmail.com", // receiver (use array of string for a list)
    subject: options.subject, // Subject line
    html: getEmail(options.params), // plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
}

/**
 * Create buttons
 * @param {Array} buttonTexts
 */
export function buttons(buttonTexts) {
  let buttons = [];
  buttonTexts.forEach((text, i) => {
    buttons.push({
      buttonId: i,
      text: text,
    });
  });
  return buttons;
}

/**
 * Get remote TXT file
 * @param {String} url
 * @returns
 */
export function remoteTxt(url) {
  return fetch(url).text();
}

/**
 * Get remote JSON file
 * @param {String} url
 * @returns
 */
export function remoteJson(url) {
  return fetch(url).json();
}

/**
 * Get remote Image (jpg, png, gif) file
 * @param {String} url
 * @returns
 */
export function remoteImg(url) {
  const filename = url.split("/").pop();
  const ext = filename.split(".").pop();
  const mimeType = `image/${ext}`;
  const response = fetch(url).buffer().toString("base64");
  return {
    filename: filename,
    base64: `data:${mimeType};base64,${response}`,
  };
}

/**
 * Get remote Audio (mp3) file
 * @param {String} url
 * @returns
 */
export function remoteAudio(url) {
  const filename = url.split("/").pop();
  const response = fetch(url).buffer().toString("base64");
  return {
    filename: filename,
    base64: `data:audio/mp3;base64,${response}`,
  };
}

/**
 * Create list
 * @param {Array} listRows
 */
export function list(listRows) {
  let rows = [];
  listRows.forEach((row) => {
    if (row.hasOwnProperty("title") && row.hasOwnProperty("description")) {
      rows.push({
        title: row.title,
        description: row.description,
      });
    } else {
      rows.push({
        title: row,
        description: " ",
      });
    }
  });
  return [
    {
      title: " ",
      rows: rows,
    },
  ];
}

/**
 * Get input from parents by reply id
 * @param {Number} id
 * @param {Array} parents
 */
export function inp(id, parents) {
  const row = parents.find((o) => o.id === id);
  return row ? row.input.replace("\n ", "") : "";
}

/**
 * Get Email
 */
function getEmail(params) {
  return (
    '<body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0;-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">' +
    '<span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>' +
    '<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">' +
    "  <tr>" +
    '    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>' +
    '    <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">' +
    '      <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">' +
    '        <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">' +
    "          <tr>" +
    '            <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">' +
    '              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">' +
    "                <tr>" +
    '                  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">' +
    '                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Hi there,</p>' +
    '                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Sometimes you just want to send a simple HTML email with a simple design and clear call to action. This is it.</p>' +
    '                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">' +
    "                      <tbody>" +
    "                        <tr>" +
    '                          <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">' +
    '                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">' +
    "                              <tbody>" +
    "                                <tr>" +
    '                                  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #3498db;" valign="top" align="center" bgcolor="#3498db"> <a href="http://htmlemail.io" target="_blank" style="border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #3498db; border-color: #3498db; color: #ffffff;">Call To Action</a> </td>' +
    "                                </tr>" +
    "                              </tbody>" +
    "                            </table>" +
    "                          </td>" +
    "                        </tr>" +
    "                      </tbody>" +
    "                    </table>" +
    '                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">This is a really simple email template. Its sole purpose is to get the recipient to click the button with no distractions.</p>' +
    '                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Good luck! Hope it works.</p>' +
    "                  </td>" +
    "                </tr>" +
    "              </table>" +
    "            </td>" +
    "          </tr>" +
    '        <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">' +
    '          <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">' +
    "            <tr>" +
    '              <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;" valign="top" align="center">' +
    '                <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Company Inc, 3 Abbey Road, San Francisco CA 94102</span>' +
    '                <br> Dont like these emails? <a href="http://i.imgur.com/CScmqnj.gif" style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">Unsubscribe</a>' +
    "              </td>" +
    "            </tr>" +
    "            <tr>" +
    '              <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;" valign="top" align="center">' +
    '                Powered by <a href="http://htmlemail.io" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">HTMLemail</a>.' +
    "              </td>" +
    "            </tr>" +
    "          </table>" +
    "        </div>" +
    "      </div>" +
    "    </td>" +
    '    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>' +
    "  </tr>" +
    "</table>" +
    "</body>"
  );
}
