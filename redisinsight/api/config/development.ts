export default {
  authentication: {
    type: 'jwt',
    clockTolerance: 9928800,
    jwksEndpoint: 'http://localhost:8125/jwks.json'
  },
  server: {
    tls: process.env.SERVER_TLS ? process.env.SERVER_TLS === 'true' : false,
  },
  sockets: {
    cors: true,
  },
  db: {
    synchronize: process.env.DB_SYNC ? process.env.DB_SYNC === 'true' : true,
    migrationsRun: process.env.DB_MIGRATIONS ? process.env.DB_MIGRATIONS === 'true' : false,
  },
  logger: {
    logLevel: process.env.LOG_LEVEL || 'debug',
    stdout: process.env.STDOUT_LOGGER ? process.env.STDOUT_LOGGER === 'true' : true, // enabled by default
    omitSensitiveData: process.env.LOGGER_OMIT_DATA ? process.env.LOGGER_OMIT_DATA === 'true' : false,
  },
};
