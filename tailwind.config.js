// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}", // Make sure this covers all your template and component files
    "./node_modules/flowbite/**/*.js" // Important for Flowbite's JS components to work with Tailwind
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin') // This is where the Flowbite plugin is added
  ],
};
