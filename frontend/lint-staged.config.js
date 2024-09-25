const config = {
  "*.{js,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,json,md}": ["prettier --write"],
};

export default config;
