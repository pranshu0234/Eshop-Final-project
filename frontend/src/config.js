const config = {
  API_URL:
    process.env.NODE_ENV === "production"
      ? "/api/v1" // In production, use relative path
      : "http://localhost:5000/api/v1", // In development, use full URL
};

export default config;
