const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config({ path: '/Users/reece/Desktop/PennApps/.env' })

// Your credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS)

// Configuration for the client
const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

const detectLanguage = async (text) => {
  try {
    let response = await translate.detect(text);
    return response[0].language;
  } catch (error) {
    console.log(`Error at detectLanguage --> ${error}`);
    return 0;
  }
};

// detectLanguage('Oggi è lunedì')
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

const translateText = async (text, targetLanguage) => {
  try {
    let [response] = await translate.translate(text, targetLanguage);
    return response;
  } catch (error) {
    console.log(`Error at translateText --> ${error}`);
    return 0;
  }
};

translateText("Oggi è lunedì", "en")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

exports.handler = async function(context, event, callback) {
    const MY_NUMBER = '+14846403929';
    console.log("working");
    let twiml = new Twilio.twiml.MessagingResponse();
    if (event.From === MY_NUMBER) {
        const separatorPosition = event.Body.indexOf(':');
        if (separatorPosition < 1) {
            twiml.message('You need to specify a recipient number and a ":" before the message.');
            console.log("wrong number");
        } else {
            const recipientNumber = event.Body.substr(0, separatorPosition).trim();
            const messageBody = event.Body.substr(separatorPosition + 1).trim();
            const translated = await translateText(messageBody, "am");
            
            console.log(messageBody);
            console.log(translated);
            twiml.message({ to: recipientNumber }, translated);
            
        }
    } else {
        const translated = await translateText(event.Body, "en");
        twiml.message({ to: MY_NUMBER }, translated);    
    }
    callback(null, twiml);
};