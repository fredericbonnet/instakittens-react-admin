Feature: Navigation

  As an administrator
  I want to navigate into all areas of the application

Background:
  Given I am an administrator
    And I sign into the application

Scenario: Home page access
   When I open the "Home Page"
   Then I should see the "Resource Menu"

Scenario Outline: Resource menu items
   When I open the "Home Page"
   Then I should see a "Menu Item" in the "Resource Menu" containing "<resource>"
Examples: 
|resource|
|  Users |
| Albums |
| Photos |
|Comments|
 
Scenario Outline: List Pages
   When I open the "<resource> List Page"
   Then I should see a "Resource List"
    And I should see a "Create Button"
    And I should see a "Show Button"
    And I should see a "Edit Button"
Examples: 
|resource|
|  Users |
| Albums |
| Photos |
|Comments|

Scenario Outline: Show pages
   When I open the "<resource> List Page"
    And I click the "Show Button"
   Then I should see a "Resource Show Page"
    And the "Page Title" should contain "<singular> #"
    And I should see a "Edit Button"
Examples: 
|resource|singular|
|  Users |  User  |
| Albums |  Album |
| Photos |  Photo |
|Comments| Comment|

Scenario Outline: Edit pages
   When I open the "<resource> List Page"
    And I click the "Edit Button"
   Then I should see a "Resource Edit Page"
    And the "Page Title" should contain "<singular> #"
    And I should see a "Show Button"
    And I should see a "Save Button"
    And I should see a "Delete Button"
Examples: 
|resource|singular|
|  Users |  User  |
| Albums |  Album |
| Photos |  Photo |
|Comments| Comment|

Scenario Outline: Parent resources
   When I open the "<resource> List Page"
   Then I should see a "<parent> Link" in the "Resource List" 
   When I click the "Show Button"
   Then I should see a "<parent> Link" in the "Resource Show Page"
   When I click the "Edit Button"
   Then I should see a "<parent> Input" in the "Resource Edit Page"
Examples: 
|resource|parent|
| Albums | User |
| Photos | Album|
|Comments| User |
|Comments| Photo|

Scenario Outline: Nested resources
   When I open the "<resource> List Page"
    And I click the "Show Button"
   Then I should see <tabs> "Tabs" in the "Resource Show Page"
    And I should see a "<nested> Tab" in the "Resource Show Page"
    And I should see a "Tab" in the "Resource Show Page" containing "<nested>"
   When I click the "Edit Button"
   Then I should see <tabs> "Tabs" in the "Resource Edit Page"
    And I should see a "<nested> Tab" in the "Resource Edit Page"
    And I should see a "Tab" in the "Resource Edit Page" containing "<nested>"
Examples: 
|resource|tabs| nested |
|  Users |  3 | Albums |
|  Users |  3 |Comments|
| Albums |  2 | Photos |
| Photos |  2 |Comments|
