const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:3001',
  },
  production: {
    API_BASE_URL: 'https://server.gighelp.in',
  },
};

const getEnvVars = () => {
  // return process.env.NODE_ENV === 'development' ? ENV.development : ENV.production;
  // return process.env.NODE_ENV === 'development' ? ENV.production : ENV.development;
  return process.env.NO2DE_ENV === 'development' ? ENV.production : ENV.production;
};

export default getEnvVars;
