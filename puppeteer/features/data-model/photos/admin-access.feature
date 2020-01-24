Feature: Admin access : Photos

  As an administrator
  I want to access the Photos

Background:
  Given I am an administrator
    And I am identified

Scenario: Getting the Photo list
   When I get the Photo list
   Then I should get the complete Photo list

Scenario: Reading a Photo
  Given an existing Photo Id "id"
   When I get the Photo "id"
   Then I should get the Photo "photo"
  Given the Photo Id "id2" of the Photo "photo"
   Then the Id "id2" should equal the Id "id"

Scenario: Reading an unknown Photo
  Given an unknown Photo Id "id"
   When I get the Photo "id"
   Then the resource should not be found

Scenario: Creating a Photo
  Given a new Photo "new photo" 
   When I create the Photo "new photo"
   Then the Photo should be created as "photo" 
    And the Photo "new photo" should equal the Photo "photo"
  Given the Photo Id "id" of the Photo "photo"
   When I get the Photo "id"
   Then I should get the Photo "photo"
    And the Photo "new photo" should equal the Photo "photo"

Scenario: Creating an existing Photo
  Given an existing Photo Id "id"
   When I get the Photo "id"
   Then I should get the Photo "photo"
   When I create the Photo "photo"
   Then the Photo should not be created

Scenario: Updating a Photo
  Given an existing Photo Id "id"
    And a new Photo "updated photo"
   When I update the Photo "id" with "updated photo" 
   Then the Photo should be updated as "photo"
    And the Photo "photo" should include the Photo "updated photo"
   When I get the Photo "id"
   Then I should get the Photo "photo"
    And the Photo "photo" should include the Photo "updated photo"

Scenario: Updating an unknown Photo 
  Given an unknown Photo Id "id"
    And a new Photo "updated photo"
   When I update the Photo "id" with "updated photo" 
   Then the resource should not be found

Scenario: Replacing a Photo
  Given an existing Photo Id "id"
    And a new Photo "replaced photo"
   When I replace the Photo "id" with "replaced photo" 
   Then the Photo should be replaced as "photo"
    And the Photo "photo" should equal the Photo "replaced photo"
   When I get the Photo "id"
   Then I should get the Photo "photo"
    And the Photo "photo" should equal the Photo "replaced photo"

Scenario: Replacing an unknown Photo 
  Given an unknown Photo Id "id"
    And a new Photo "replaced photo"
   When I replace the Photo "id" with "replaced photo" 
   Then the resource should not be found

Scenario: Deleting a Photo
  Given a new Photo "deleted photo" 
    And I create the Photo "deleted photo"
    And the Photo should be created as "photo" 
  Given the Photo Id "id" of the Photo "photo"
   When I delete the Photo "id"
   Then the resource should be deleted
   When I get the Photo "id"
   Then the resource should not be found

Scenario: Deleting an unknown Photo
  Given an unknown Photo Id "id"
   When I delete the Photo "id"
   Then the resource should not be found
