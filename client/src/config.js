const config = {
  development: {
    API_URL: "http://localhost:5000",
  },
  production: {
    API_URL: "https://chat-app-2gnu.onrender.com/",
  },
};

export default config[process.env.NODE_ENV];
