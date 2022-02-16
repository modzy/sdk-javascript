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
async function createJobWithTextInput() {
  try {
    // Look up the model id and latest version
    const { modelId, latestActiveVersion } = await modzyClient.getModelByName(
      "Sentiment Analysis"
    );

    // Submit a job to the Sentiment Analysis model
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

    // Get the results
    const results = await modzyClient.getResult(jobIdentifier);
    console.log("results", results);
  } catch (error) {
    console.error(error);
  }
}

createJobWithTextInput();
