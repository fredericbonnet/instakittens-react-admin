Feature: Logout

  As an identified user
  I want to log out of the application

Background:
  Given I am an administrator
    And I sign into the application

Scenario: Logout
   When I open the "Home Page"
   Then I should see a "Profile Menu Button"
   When I click on the "Profile Menu Button"
   Then I should see a "Logout Menu Item"
   When I click on the "Logout Menu Item"
   Then I should not see the "Profile Menu Button"
    And I should not see the "Logout Menu Item"
    And I should be redirected to the "Login Page"
 