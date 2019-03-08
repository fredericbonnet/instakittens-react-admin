Feature: Navigation

  As an administrator
  I want to navigate into all areas of the application

Background:
  Given I am an administrator
    And I sign into the application

Scenario: Home page access
   When I go to the Home Page
   Then I should see the Resource Menu

Scenario Outline: Resource menu items
   When I go to the Home Page
   Then I should see a <resource> Menu Item
Examples: 
|resource|
|  Users |
| Albums |
| Photos |
|Comments|
 
Scenario Outline: List Pages
   When I go to the <resource> List Page
   Then I should see a Resource List
    And I should see a Create Button
    And I should see a Show Button
    And I should see an Edit Button
Examples: 
|resource|
|  Users |
| Albums |
| Photos |
|Comments|

Scenario Outline: Show pages
   When I go to the <resource> List Page
    And I click the Show Button
   Then I should see a <resource> Show Page
    And the Page Title should contain "<singular> #"
    And I should see an Edit Button
Examples: 
|resource|singular|
|  Users |  User  |
| Albums |  Album |
| Photos |  Photo |
|Comments| Comment|

Scenario Outline: Edit pages
   When I go to the <resource> List Page
    And I click the Edit Button
   Then I should see a <resource> Edit Page
    And the Page Title should contain "<singular> #"
    And I should see a Show Button
    And I should see a Save Button
    And I should see a Delete Button
Examples: 
|resource|singular|
|  Users |  User  |
| Albums |  Album |
| Photos |  Photo |
|Comments| Comment|

Scenario Outline: Parent resources
   When I go to the <resource> List Page
   Then I should see a <parent> Link in the Resource List
   When I click the Show Button
   Then I should see a <parent> Link on the Show Page
   When I click the Edit Button
   Then I should see a <parent> Input on the Edit Page
Examples: 
|resource|parent|
| Albums | User |
| Photos | Album|
|Comments| User |
|Comments| Photo|

Scenario Outline: Nested resources
   When I go to the <resource> List Page
    And I click the Show Button
   Then I should see <tabs> tabs on the Show Page
    And I should see a <nested> tab on the Show Page
   When I click the Edit Button
   Then I should see <tabs> tabs on the Edit Page
    And I should see a <nested> tab on the Edit Page
Examples: 
|resource|tabs| nested |
|  Users |  3 | Albums |
|  Users |  3 |Comments|
| Albums |  2 | Photos |
| Photos |  2 |Comments|
