import React, { useState } from "react";
import styles from "./twitterPage.module.css";

import { Copy } from "react-feather";

import {
  generateTweets,
  generateThreads,
  generateImageForThread,
  generateImage,
} from "../../api/api";
import { toast } from "react-hot-toast";

import TwitterCard from "./../twittercard/TwitterCard";

const TwitterPage = () => {
  const [inputPrompt, setInputPrompt] = useState("");
  const [generating, setGenerating] = useState({
    prompt: false,
    thread: false,
    image: false,
  });
  const [prompts, setPrompts] = useState([]);
  const [threads, setThreads] = useState([]);
  const [imageUrl, setImageUrl] = useState({
    url: "",
  });

  const generateRandomId = () =>
    parseInt(Math.random() * 88556644 + Date.now().toString(16));

  const handleValue = (val, id) => {
    if (threads.length < 0) return;
    const tempThread = [...threads];
    const indexPos = tempThread.findIndex((item) => item.id === id);
    tempThread[indexPos].value = val;
    setThreads(tempThread);
  };

  const addCard = (index) => {
    const tempThread = [...threads];
    tempThread.splice(index + 1, 0, {
      id: generateRandomId(),
      value: "",
      placeholder: "Write here...",
    });
    setThreads(tempThread);
  };

  const closeCard = (index) => {
    const tempThread = [...threads];
    tempThread.splice(index, 1);
    setThreads(tempThread);
  };

  const createPrompt = async () => {
    if (!inputPrompt.trim()) return;
    try {
      setPrompts([]);
      setGenerating((prev) => ({ ...prev, prompt: true }));
      const res = await generateTweets(inputPrompt.trim());
      setGenerating((prev) => ({ ...prev, prompt: false }));

      let ans = Array.isArray(res.choices)
        ? res.choices.map((item) => item.text.trim())
        : "";
      setPrompts(ans);
    } catch (error) {
      console.log("Error in generating prompts", error);
    }
  };

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item);
    toast.success("Copied");
  };

  const generateTweetThread = async () => {
    const tempThread = [...threads];
    const lastTweet = tempThread.pop().value;

    setGenerating((prev) => ({ ...prev, thread: true }));
    const res = await generateThreads(lastTweet);
    setGenerating((prev) => ({ ...prev, thread: false }));

    if (!res) return;
    const ans = Array.isArray(res.choices) ? res.choices[0].text : "";
    const newThread = ans
      .split("\n")
      .filter((item) => item.trim())
      .map((item) => item.slice(2).trim());

    const finalThread = newThread.map((item) => ({
      id: generateRandomId(),
      placeholder: "Write here...",
      value: item,
    }));
    setThreads([...threads, ...finalThread]);
  };

  const imageForThread = async () => {
    const lastMsg = threads[0].value;
    if (!lastMsg) return;
    setGenerating((prev) => ({ ...prev, image: true }));
    const res1 = await generateImageForThread(lastMsg);
    const res2 = await generateImage(res1);
    setGenerating((prev) => ({ ...prev, image: false }));
    setImageUrl({ url: res2 });
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.top}>
          <div className={styles.title}>So,Whats in your mind today?</div>
          <textarea
            name="textarea"
            placeholder="Enter here..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
          ></textarea>
          <button
            className="button"
            onClick={createPrompt}
            disabled={generating.prompt}
          >
            {generating.prompt ? "Generating..." : "Generate prompts"}
          </button>
        </div>

        <div className={styles.line}></div>

        <div className={styles.bottom}>
          <div className={styles.title}>Suggested prompts</div>
          <div className={styles.prompts}>
            {prompts.length === 0 ? (
              generating.prompt ? (
                "Generating..."
              ) : (
                <p>No prompts to show! Generate some new prompts</p>
              )
            ) : (
              prompts.map((item, index) => (
                <div key={index} className={styles.promptCard}>
                  <div className={styles.text}>{item}</div>
                  <div className={styles.line}></div>
                  <div className="icon" onClick={() => handleCopy(item)}>
                    <Copy />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className={styles.hLine}></div>
      <div className={styles.right}>
        <div className={styles.title}>Your tweets</div>
        {threads.length !== 0 ? (
          <div className={styles.imgBox}>
            {imageUrl.url && <img src={imageUrl?.url} alt="IMG" />}

            <button
              className={styles.btn}
              onClick={() => imageForThread()}
              disabled={generating.image}
            >
              {generating.image ? "Generating Image..." : " Generate image"}
            </button>
          </div>
        ) : (
          ""
        )}

        {threads.length === 0 ? (
          <button
            className={styles.btn}
            style={{ marginLeft: "auto" }}
            onClick={() =>
              setThreads([
                {
                  id: generateRandomId(),
                  placeholder: "Write here...",
                  value: "",
                },
              ])
            }
          >
            + Write a tweet
          </button>
        ) : (
          ""
        )}
        <div className={styles.results}>
          {threads.map((item, index) => {
            return (
              <TwitterCard
                key={index}
                id={item.id}
                tweet={item.value}
                placeholder={item.placeholder}
                showGenerateThreadButton={index === threads.length - 1}
                updateContent={(val) => handleValue(val, item.id)}
                handleClose={() => closeCard(index)}
                handleAdd={() => addCard(index)}
                generateThread={(val) => generateTweetThread(val)}
                generating={generating.thread}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TwitterPage;
