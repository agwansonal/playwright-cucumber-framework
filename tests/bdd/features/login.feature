Feature: Login functionality

  As a registered user
  I want to be able to log in with valid credentials
  So that I can access my account securely

   @login
  Scenario: Successful login with valid credentials
    Given I navigate to the login page
    When I log in with valid credentials
    Then I should be logged in successfully

  @login
  Scenario: Invalid login with wrong credentials
    Given I navigate to the login page
    When I log in with invalid credentials
    Then I should see an invalid login error
