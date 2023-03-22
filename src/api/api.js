const secretKey = process.env.REACT_APP_OSI_KEY;

export const generateTweets = async (prompt) => {
  if (!prompt) return;

  try {
    const res = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Give me a catchy tweet on the following prompt:\n ${prompt}`,
        max_tokens: 70,
        temperature: Math.random(),
        n: 10,
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error in getting response", error);
    return false;
  }
};

export const generateThreads = async (tweet) => {
  if (!tweet) return;

  try {
    const res = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Generate a twitter thread of 6 tweets with maximum 280 characters for the following tweet:\n ${tweet}`,
        // prompt: `Generate similar 6 tweets for this tweet:\n ${tweet}`,
        max_tokens: 350,
        temperature: Math.random(),
        n: 1,
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error in getting response", error);
    return false;
  }
};

export const generateImageForThread = async (tweet) => {
  if (!tweet) return;

  try {
    const res = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Generate a suitable title with maximum 60 characters for this tweet:\n ${tweet}`,
        max_tokens: 15,
        temperature: Math.random(),
        n: 1,
      }),
    });
    const data = await res.json();
    const title = Array.isArray(data.choices)
      ? data?.choices[0].text.trim()
      : "";
    return title;
  } catch (error) {
    console.log("Error in getting response", error);
    return false;
  }
};
export const generateImage = async (title) => {
  if (!title) return;

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        prompt: `Generate a suitable image for this title:\n ${title}`,
        n: 1,
        size: "512x512",
      }),
    });
    const data = await res.json();
    const url = Array.isArray(data.data) ? data?.data[0]?.url : "";
    return url;
  } catch (error) {
    console.log("Error in getting response", error);
    return false;
  }
};
