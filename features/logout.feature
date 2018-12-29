Feature: Logout

  As an identified user
  I want to log out of the application

Background:
  Given I am an administrator
    And I sign into the application

Scenario: Logout
   Then I should see the Profile Menu Button
   When I click on the Profile Menu Button
   Then I should see the Logout Menu Item
   When I click on the Logout Menu Item
   Then I should not see the Profile Menu Button
    And I should not see the Logout Menu Item
    And I should see the Login Form
 