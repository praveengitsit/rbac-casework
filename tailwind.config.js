// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}", // Make sure this covers all your template and component files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF3399', 
      }
    },
  },
  plugins: [
  ],
};
