import React from "react";

const colorMap = {
  GPT4: "#e41a1c",
  Gemini: "#377eb8",
  PaLM2: "#4daf4a",
  Claude: "#984ea3",
  LLaMA: "#ff7f00"
};

const Legend = () => {
  const models = ["GPT4", "Gemini", "PaLM2", "Claude", "LLaMA"];

  return (
    <div style={{ marginLeft: "20px" }}>
      <h3>Legend</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {models.map((model) => (
          <li key={model} style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
            <span
              style={{
                display: "inline-block",
                width: "18px",
                height: "18px",
                backgroundColor: colorMap[model],
                marginRight: "10px"
              }}
            />
            {model.replace("GPT4", "GPT-4").replace("PaLM2", "PaLM-2").replace("LLaMA", "LLaMA-3.1")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
