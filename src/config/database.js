module.exports = {
  dialect: 'postgres',
  host: '192.168.99.100',
  username: 'postgres',
  password: 'fast',
  database: 'fastfeet',
  port: 5433,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
