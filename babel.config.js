module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 8,
          },
        },
      ],
      
    ],   
    plugins: [
      [require("@babel/plugin-proposal-class-properties"), { loose: false }]
    ]
  };