module.exports = {
    "/api/v1": {
      target: "http://localhost:5001",
      secure: false,
      changeOrigin: true
    },
    "/api/v2": {
      target: "http://localhost:5002",
      secure: false,
      changeOrigin: true
    }
  };