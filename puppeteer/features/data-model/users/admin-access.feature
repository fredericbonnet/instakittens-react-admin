Feature: Admin access : Users

  As an administrator
  I want to access the Users

Background:
  Given I am an administrator
    And I am identified

Scenario: Getting the User list
   When I get the User list
   Then I should get the complete User list

Scenario: Reading a User
  Given an existing User Id "id"
   When I get the User "id"
   Then I should get the User "user"
  Given the User Id "id2" of the User "user"
   Then the Id "id2" should equal the Id "id"

Scenario: Reading an unknown User
  Given an unknown User Id "id"
   When I get the User "id"
   Then the resource should not be found

Scenario: Creating a User
  Given a new User "new user" 
   When I create the User "new user"
   Then the User should be created as "user" 
    And the User "new user" should equal the User "user"
  Given the User Id "id" of the User "user"
   When I get the User "id"
   Then I should get the User "user"
    And the User "new user" should equal the User "user"

Scenario: Creating an existing User
  Given an existing User Id "id"
   When I get the User "id"
   Then I should get the User "user"
   When I create the User "user"
   Then the User should not be created

Scenario: Updating a User
  Given an existing User Id "id"
    And a new User "updated user"
   When I update the User "id" with "updated user" 
   Then the User should be updated as "user"
    And the User "user" should include the User "updated user"
   When I get the User "id"
   Then I should get the User "user"
    And the User "user" should include the User "updated user"

Scenario: Updating an unknown User 
  Given an unknown User Id "id"
    And a new User "updated user"
   When I update the User "id" with "updated user" 
   Then the resource should not be found

Scenario: Replacing a User
  Given an existing User Id "id"
    And a new User "replaced user"
   When I replace the User "id" with "replaced user" 
   Then the User should be replaced as "user"
    And the User "user" should equal the User "replaced user"
   When I get the User "id"
   Then I should get the User "user"
    And the User "user" should equal the User "replaced user"

Scenario: Replacing an unknown User 
  Given an unknown User Id "id"
    And a new User "replaced user"
   When I replace the User "id" with "replaced user" 
   Then the resource should not be found

Scenario: Deleting a User
  Given a new User "deleted user" 
    And I create the User "deleted user"
    And the User should be created as "user" 
  Given the User Id "id" of the User "user"
   When I delete the User "id"
   Then the resource should be deleted
   When I get the User "id"
   Then the resource should not be found

Scenario: Deleting an unknown User
  Given an unknown User Id "id"
   When I delete the User "id"
   Then the resource should not be found
