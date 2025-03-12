import OpenAI from "openai";

// Create a function to initialize the GitHub client with the token
export const initGithubClient = (token) => {
  if (!token) {
    throw new Error("GitHub token is required to initialize the client");
  }
  
  return new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: token,
    dangerouslyAllowBrowser: true

  });
};

export const generateTweets = async (prompt, token) => {
  if (!prompt) return;
  
  try {
    const githubClient = initGithubClient(token);
    
    const response = await githubClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a creative tweet generator. Create catchy and engaging tweets." 
        },
        { 
          role: "user", 
          content: `Give me 10 catchy tweets on the following prompt:\n${prompt}` 
        }
      ],
      temperature: Math.random(),
      max_tokens: 1000
    });

    // Format the response to match your expected data structure
    return {
      choices: response.choices[0].message.content
        .split('\n\n')
        .filter(tweet => tweet.trim())
        .map(tweet => ({ text: tweet.replace(/^\d+\.\s*/, '') }))
    };
  } catch (error) {
    console.log("Error in getting response", error);
    return false;
  }
};

export const generateThreads = async (tweet, token) => {
  if (!tweet) return;

  try {
    const githubClient = initGithubClient(token);
    
    const response = await githubClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a Twitter thread creator. Create engaging Twitter threads." 
        },
        { 
          role: "user", 
          content: `Generate a twitter thread of 6 tweets with maximum 280 characters for the following tweet:\n${tweet}` 
        }
      ],
      temperature: Math.random(),
      max_tokens: 1000
    });

    return {
      choices: [{ text: response.choices[0].message.content }]
    };
  } catch (error) {
    console.log("Error in getting response", error);
    return false;
  }
};

export const generateImageForThread = async (tweet, token) => {
  if (!tweet) return;

  try {
    const githubClient = initGithubClient(token);
    
    const response = await githubClient.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { 
          role: "system", 
          content: "You generate concise image titles." 
        },
        { 
          role: "user", 
          content: `Generate a suitable title with maximum 60 characters for this tweet:\n${tweet}` 
        }
      ],
      temperature: Math.random(),
      max_tokens: 50
    });

    const title = response.choices[0].message.content.trim();
    return title;
  } catch (error) {
    console.log("Error in getting response", error);
    return false;
  }
};

export const generateImage = async (title, token) => {
  if (!title) return;

  try {
    const githubClient = initGithubClient(token);
    
    // For image description since we can't generate actual images
    const response = await githubClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You create detailed image descriptions that can be used as placeholders or for text-to-image generators."
        },
        {
          role: "user",
          content: `Describe a suitable image for this title in 100 words or less:\n${title}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });
    
    // Return the description as a fallback since we can't generate actual images
    const imageDescription = response.choices[0].message.content.trim();
    
    return {
      description: imageDescription,
      url: "" // No URL available with github client only
    };
  } catch (error) {
    console.log("Error in getting image description", error);
    return false;
  }
};

  