module: {
  rules: [
    {
      test: /\.scss$/,
      use: [
        { loader: "style-loader" },
        {
          loader: "css-loader",
          options: {
            sourceMap: true,
            modules: true,
            localIdentName: "[local]_[hash:base64:5]",
          },
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: true,
            config: {
              path: "../js/postcss.config.js",
            },
          },
        },
        {
          loader: "sass-loader",
          options: { sourceMap: true },
        },
      ],
    },
  ];
}
