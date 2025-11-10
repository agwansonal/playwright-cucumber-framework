const testData = {
  login: {
    validUser: {
      username: 'student',
      password: 'Password123',
    },
    invalidUser: {
      username: 'wrongUser',
      password: 'wrongPass',
    },
  },
  urls: {
    login: '/practice-test-login/',
  },
  messages: {
    success: 'Logged In Successfully',
    invalid: 'Your username is invalid!',
  },
};

module.exports = { testData };

