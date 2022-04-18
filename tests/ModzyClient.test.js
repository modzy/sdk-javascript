import "dotenv/config";
import { ModzyClient } from "../src/index";

const apiKey = process.env.API_KEY;
const modzyClient = new ModzyClient({ apiKey });

const EXAMPLE_MODEL_ID = "ed542963de"; // Sentiment Analysis
const EXAMPLE_MODEL_NAME = "Sentiment Analysis"; // Sentiment Analysis
const EXAMPLE_MODEL_VERSION = "1.0.1"; // Sentiment Analysis
const EXAMPLE_MODEL_INPUT_NAME = "input.txt"; // Sentiment Analysis

describe("Setup", () => {
  test("api key from .env file exists", () => {
    expect(apiKey).toBeDefined();
  });

  test("modzyClient is initialized", () => {
    expect(modzyClient).toBeDefined();
  });
});

describe("Model methods", () => {
  test("getModels, no params", async () => {
    const models = await modzyClient.getModels();
    expect(models).toBeDefined();
    expect(models).not.toHaveLength(0);
    models.forEach((model) => {
      expect(model.modelId).toBeDefined();
      expect(model.latestVersion).toBeDefined();
      expect(model.versions).toBeDefined();
    });
  });

  test("getModels, with param", async () => {
    const models = await modzyClient.getModels({ modelId: EXAMPLE_MODEL_ID });

    expect(models).toBeDefined();
    expect(models).toHaveLength(1);
    models.forEach((model) => {
      expect(model.modelId).toBeDefined();
      expect(model.latestVersion).toBeDefined();
      expect(model.versions).toBeDefined();
    });
  });

  test("getActiveModels", async () => {
    const models = await modzyClient.getActiveModels();
    expect(models).toBeDefined();
    expect(models).not.toHaveLength(0);

    // This list could be long, so we're just testing the first item
    const model = models[0];
    expect(model.identifier).toBeDefined();
    expect(model.name).toBeDefined();
    expect(model.author).toBeDefined();
    expect(model.latestVersion).toBeDefined();
    expect(model.activeVersions).toBeDefined();
  });

  test("getModelById", async () => {
    const model = await modzyClient.getModelById(EXAMPLE_MODEL_ID);
    expect(model.modelId).toBeDefined();
    expect(model.latestVersion).toBeDefined();
    expect(model.versions).toBeDefined();
  });

  test("getModelByName", async () => {
    const model = await modzyClient.getModelByName(EXAMPLE_MODEL_NAME);
    expect(model.modelId).toBeDefined();
    expect(model.latestVersion).toBeDefined();
    expect(model.versions).toBeDefined();
  });

  test("getModelVersionsById", async () => {
    const versions = await modzyClient.getModelVersionsById(EXAMPLE_MODEL_ID);
    expect(versions).toBeDefined();
    expect(versions).not.toHaveLength(0);
    versions.forEach((version) => {
      expect(version.version).toBeDefined();
    });
  });

  test("getModelDetails", async () => {
    const details = await modzyClient.getModelDetails({
      modelId: EXAMPLE_MODEL_ID,
      version: EXAMPLE_MODEL_VERSION,
    });
    expect(details).toBeDefined();
    expect(details.version).toBeDefined();
    expect(details.createdBy).toBeDefined();
    expect(details.model).toBeDefined();
    expect(details.model.name).toBeDefined();
  });

  test("getModelVersionInputSample", async () => {
    const sample = await modzyClient.getModelVersionInputSample({
      modelId: EXAMPLE_MODEL_ID,
      version: EXAMPLE_MODEL_VERSION,
    });
    expect(sample).toBeDefined();
  });

  test("getModelVersionOutputSample", async () => {
    const sample = await modzyClient.getModelVersionOutputSample({
      modelId: EXAMPLE_MODEL_ID,
      version: EXAMPLE_MODEL_VERSION,
    });
    expect(sample).toBeDefined();
  });
});

describe("Job methods", () => {
  let jobId;

  test("submitJobText", async () => {
    const job = await modzyClient.submitJobText({
      modelId: EXAMPLE_MODEL_ID,
      version: EXAMPLE_MODEL_VERSION,
      sources: {
        myInput: {
          [EXAMPLE_MODEL_INPUT_NAME]: "Sometimes I really hate ribs",
        },
      },
    });
    expect(job).toBeDefined();
    expect(job.jobIdentifier).toBeDefined();
    expect(job.status).toBeDefined();
    jobId = job.jobIdentifier;
  });

  test("submitJobEmbedded", async () => {
    const embeddedFile = await modzyClient.pathToDataUrl(
      "./tests/sample.txt",
      "text/plain"
    );
    const job = await modzyClient.submitJobText({
      modelId: EXAMPLE_MODEL_ID,
      version: EXAMPLE_MODEL_VERSION,
      sources: {
        myInput: {
          [EXAMPLE_MODEL_INPUT_NAME]: embeddedFile,
        },
      },
    });
    expect(job).toBeDefined();
    expect(job.jobIdentifier).toBeDefined();
    expect(job.status).toBeDefined();
  });

  test("submitJobFile", async () => {
    const job = await modzyClient.submitJobFile({
      modelId: EXAMPLE_MODEL_ID,
      version: EXAMPLE_MODEL_VERSION,
      sources: {
        myInput: {
          [EXAMPLE_MODEL_INPUT_NAME]: "./tests/sample.txt",
        },
      },
    });
    expect(job).toBeDefined();
    expect(job.jobIdentifier).toBeDefined();
    expect(job.status).toBeDefined();
  });

  test("getJobHistory", async () => {
    const history = await modzyClient.getJobHistory();
    expect(history).toBeDefined();
    expect(history).not.toHaveLength(0);
  });

  test("getJob", async () => {
    const job = await modzyClient.getJob(jobId);
    expect(job).toBeDefined();
    expect(job.jobIdentifier).toBeDefined();
    expect(job.status).toBeDefined();
  });

  test("getProcessingEngineStatus", async () => {
    const engines = await modzyClient.getProcessingEngineStatus();
    expect(engines).toBeDefined();
    expect(engines).not.toHaveLength(0);
  });

  test("getResult", async () => {
    await modzyClient.blockUntilJobComplete(jobId);
    const result = await modzyClient.getResult(jobId);
    expect(result).toBeDefined();
    expect(result.jobIdentifier).toBeDefined();
    expect(result.results).toBeDefined();
  }, 60000); // increase test timeout to 1 min

  test("getOutputContents", async () => {
    await modzyClient.blockUntilJobComplete(jobId);
    const output = await modzyClient.getOutputContents({
      jobId,
      inputKey: "myInput",
      outputName: "results.json",
    });
    expect(output).toBeDefined();
  }, 60000); // increase test timeout to 1 min
});
