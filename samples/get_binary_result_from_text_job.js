const fs = require("fs");
const { ModzyClient } = require("@modzy/modzy-sdk");

// The MODZY_API_KEY is your own personal API key. It is composed by a public part,
// a dot character, and a private part
// (ie: AzQBJ3h4B1z60xNmhAJF.uQyQh8putLIRDi1nOldh).
const API_KEY = process.env.MODZY_API_KEY;

// Client initialization:
// Initialize the ApiClient instance with the API_KEY. We're using app.modzy.com, so a
// `url` is not specified
const modzyClient = new ModzyClient({
  apiKey: API_KEY,
  logging: "on",
});

// This is async function that will do all the work
async function submitTextToSpeechJob() {
  try {
    // Look up the model id and latest version
    const { modelId, latestActiveVersion } = await modzyClient.getModelByName(
      "Text to Speech Conversion"
    );

    // Submit a job to the Text to Speech model
    const { jobIdentifier } = await modzyClient.submitJobText({
      modelId,
      version: latestActiveVersion,
      sources: {
        myInput: {
          "input.txt": "Sometimes I really hate ribs",
        },
      },
    });

    // Wait until the job is complete
    await modzyClient.blockUntilJobComplete(jobIdentifier);

    // Get the raw output contents
    const speechContents = await modzyClient.getOutputContents({
      jobId: jobIdentifier,
      inputKey: "myInput",
      outputName: "results.wav",
      responseType: "arraybuffer",
    });

    // Write the output to disk
    fs.writeFileSync("./results.wav", speechContents);

    console.log("done - results.wav written to disk");
  } catch (error) {
    console.error(error);
  }
}

submitTextToSpeechJob();
