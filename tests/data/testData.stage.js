const testData = {
    login: {
      validUser: { username: 'stageUser', password: 'StagePass123' },
      invalidUser: { username: 'invalidStage', password: 'wrong' },
    },
    messages: {
      loginSuccess: 'Welcome to STAGE!',
      loginError: 'Invalid credentials in STAGE.',
    },
    urls: {
      home: '/',
      login: '/login',
      dashboard: '/dashboard',
    },
  };
  
  module.exports = { testData };