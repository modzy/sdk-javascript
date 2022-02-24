/**
 * This is an example React component that renders a form that allows the user to select
 * a file to send to the Image-Based Geolocation model. Once the form is submitted,
 * the results.json output is fetched and displayed below the form
 */
import { useState } from "react";

import { ModzyClient } from "@modzy/modzy-sdk";

export default function TextToSpeech() {
  const [isWorking, setWorking] = useState(false);

  // This function is called once the user submits the form
  async function handleSubmit(event) {
    event.preventDefault();
    setWorking(true);

    // initialize the client
    const modzyClient = new ModzyClient({
      apiKey: "XXXXXXXX.XXXXXXXXXXXXX", // Your API key here
    });

    try {
      // get the contents of the textarea
      const text = new FormData(event.currentTarget).get("textInput");
      console.log("text", text);

      // If there text, then we submit the job
      if (text) {
        const { jobIdentifier } = await modzyClient.submitJobText({
          modelId: "uvdncymn6q",
          version: "0.0.3",
          sources: {
            myInput: {
              "input.txt": text,
            },
          },
        });

        // Wait for the job to complete
        await modzyClient.blockUntilJobComplete(jobIdentifier);

        // Get the output contents with the responseType of "blob" because it's a binary
        const speechContents = await modzyClient.getOutputContents({
          jobId: jobIdentifier,
          inputKey: "myInput",
          outputName: "results.wav",
          responseType: "blob",
        });

        // create a hidden link that will download the file
        const url = window.URL.createObjectURL(
          new Blob([speechContents], { type: "audio/wav" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "results.wav");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setWorking(false);
    }
  }

  return (
    <div style={{ padding: "32px" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="textInput"
            style={{ display: "block", marginBottom: "4px" }}
          >
            Text to be converted to speech
          </label>
          <textarea id="textInput" name="textInput" rows="4" cols="50" />
        </div>
        <button type="submit" disabled={isWorking}>
          {isWorking ? "Getting result ..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
