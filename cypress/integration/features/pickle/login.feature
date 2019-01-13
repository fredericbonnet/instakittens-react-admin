Feature: Login

  As a user
  I want to identify myself
  In order to use the application

Background:
  Given I open the "Login Page"
  Given I should see the "Login Form"

Scenario: Login form
   Then I should see a "Username Input" inside the "Login Form"
    And I should see a "Password Input" inside the "Login Form"
    And I should see a "Sign In Button" inside the "Login Form"
   
Scenario: Username validation
   When I click on the "Username Input" inside the "Login Form"
    And I click on the "Sign In Button" inside the "Login Form"
   Then I should see a "Username Helper Text" inside the "Login Form"
    And I should see the "Login Form"
   When I type "username" into the "Username Input" inside the "Login Form"
   Then I should not see a "Username Helper Text" inside the "Login Form"
    And I should see the "Login Form"
   
Scenario: Password validation
   When I click on the "Password Input" inside the "Login Form"
   When I click on the "Sign In Button" inside the "Login Form"
   Then I should see a "Password Helper Text" inside the "Login Form"
    And I should see the "Login Form"
   When I type "password" into the "Password Input" inside the "Login Form"
   Then I should not see a "Password Helper Text" inside the "Login Form"
    And I should see the "Login Form"

Scenario Outline: Incorrect credentials
  Given I am <account_type>
   When I type my username in the "Username Input" inside the "Login Form"
    And I type "badpassword" in the "Password Input" inside the "Login Form"
    And I click on the "Sign In Button" inside the "Login Form"
   Then I should see a "Warning Message"
    And I should see the "Login Form"
   Examples: 
|   account_type  |
| an unknown user |
|a registered user|
| an administrator|
   
Scenario: User login
  Given I am a registered user
   When I type my username in the "Username Input" inside the "Login Form"
    And I type my password in the "Password Input" inside the "Login Form"
    And I click on the "Sign In Button" inside the "Login Form"
   Then I should see the "Login Form"
   
Scenario: Admin login
  Given I am an administrator
   When I type my username in the "Username Input" inside the "Login Form"
    And I type my password in the "Password Input" inside the "Login Form"
    And I click on the "Sign In Button" inside the "Login Form"
   Then I should not see a "Warning Message"
   Then I should not see the "Login Form"
