type Config = {
  apiUrl: string;
  userApiUrl: string;
  featureEditTask: boolean;
  featureDeleteTask: boolean;
};

let config: Config | null = null;

export const loadConfig = async (): Promise<Config> => {
  if (config !== null) return config;
  try {
    const response = await fetch("/config.json");
    const json = await response.json();
    config = {
      apiUrl: json.apiUrl || "http://localhost:3000",
      userApiUrl: json.userApiUrl || "http://localhost:4000",
      featureEditTask: json.featureEditTask === true || json.featureEditTask === "true",
      featureDeleteTask: json.featureDeleteTask === true || json.featureDeleteTask === "true",
    };
    return config;
  } catch {
    config = {
      apiUrl: "http://localhost:3000",
      userApiUrl: "http://localhost:4000",
      featureEditTask: false,
      featureDeleteTask: false,
    };
    return config;
  }
};
