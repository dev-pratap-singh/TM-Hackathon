import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { Festivals } from "./Festivals";

export const PromptGen = () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [folder, setFolder] = useState("");

  const handleChange = (event: any) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    for (let i = 0; i < Festivals.length; i++) {
      setLoading(true);
      const word = Festivals[i];
      if (prompt.includes(word)) {
        setFolder(word);
        break;
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  return (
    <div>
      <div className="searchbox">
        <form onSubmit={handleSubmit}>
          <div className="flexrow" style={{ height: "100%", width: "100%" }}>
            <input
              placeholder="Enter your prompt here"
              value={prompt}
              onChange={handleChange}
              className="inputprompt"
            />
            <button type="submit" className="motorsubmit">
              Submit
            </button>
          </div>
        </form>
      </div>
      {loading ? (
        <Loader />
      ) : folder ? (
        <div style={{ marginTop: "10px" }}>
          {Array.from(Array(20).keys()).map((index) => (
            <Link to={`/poster/${folder}/${index + 1}`} key={index}>
              <img
                className="singleimg"
                key={index}
                src={`images/PosterGeneration/${folder}/${index + 1}.jpg`}
                alt={`${folder} ${index + 1}`}
              />
            </Link>
          ))}
        </div>
      ) : (
        <p>Enter Prompt to generate some images!</p>
      )}
    </div>
  );
};
