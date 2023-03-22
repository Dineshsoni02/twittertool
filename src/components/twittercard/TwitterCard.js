import React, { useState } from "react";
import styles from "./twitterCard.module.css";

import { X, Copy, Plus } from "react-feather";
import { toast } from "react-hot-toast";

const TwitterCard = ({
  tweet,
  updateContent,
  placeholder,
  generateThread,
  handleClose,
  handleAdd,
  showGenerateThreadButton = false,
  generating,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const progress = (tweet.length / 280) * 100;
  const progressDeg = parseInt((progress * 360) / 100);
  const charLeft = 280 - tweet.length;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };
  // console.log(generating + "twitter card");
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {isEditing ? (
          <textarea
            placeholder={placeholder || "Write here..."}
            autoFocus
            defaultValue={tweet}
            onBlur={() => setIsEditing(false)}
            onChange={(e) =>
              updateContent ? updateContent(e.target.value) : ""
            }
          ></textarea>
        ) : tweet.length === 0 ? (
          <p onClick={() => setIsEditing(true)}>{placeholder}</p>
        ) : (
          <p onClick={() => setIsEditing(true)}>{tweet}</p>
        )}
        <div
          className={`icon ${styles.closeIcon}`}
          onClick={() => (handleClose ? handleClose() : "")}
        >
          <X />
        </div>
      </div>
      <div className={styles.bottom}>
        <div
          className={`icon ${styles.copyIcon}`}
          onClick={() => handleCopy(tweet)}
        >
          <Copy />
        </div>
        <div className={styles.btmRight}>
          <div
            className={styles.progress}
            style={{
              "--color": charLeft < 0 ? "red" : "#55acee",
              "--deg": `${progressDeg}deg`,
            }}
          >
            <div className={styles.inner}>{charLeft < 60 ? charLeft : ""}</div>
          </div>

          <div className={styles.line}></div>

          <div
            className={`icon ${styles.addIcon}`}
            onClick={() => (handleAdd ? handleAdd() : "")}
          >
            <Plus />
          </div>

          {showGenerateThreadButton ? (
            <>
              <div className={styles.line}></div>
              <button
                className="button"
                onClick={() => (generateThread ? generateThread(tweet) : "")}
                disabled={generating}
              >
                {generating ? "Generating..." : " Generate thread"}
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default TwitterCard;
