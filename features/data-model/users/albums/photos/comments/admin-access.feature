Feature: Admin access : User Album Photo Comments

  As an administrator
  I want to access User Album Photo Comments

Background:
  Given I am an administrator
    And I am identified
  Given a User Id "user id" with albums
   When I get the User "user id"
   Then I should get the User "user"
    And I open the User "user"
  Given an existing public Album Id "album id"
   When I get the Album "album id"
   Then I should get the Album "album"
    And I open the Album "album"
  Given an existing Photo Id "photo id"
   When I get the Photo "photo id"
   Then I should get the Photo "photo"
    And I open the Photo "photo"

Scenario: Getting the Comment list
   When I get the Comment list
   Then I should get the complete Comment list

Scenario: Reading a Comment
  Given an existing Comment Id "id"
   When I get the Comment "id"
   Then I should get the Comment "comment"
  Given the Comment Id "id2" of the Comment "comment"
   Then the Id "id2" should equal the Id "id"
  Given the Photo Id "photo id2" of the Comment "comment"
   Then the Id "photo id2" should equal the Id "photo id"

Scenario: Reading an unknown Comment
  Given an unknown Comment Id "id"
   When I get the Comment "id"
   Then the resource should not be found

Scenario: Creating a Comment
  Given a new Comment "new comment" 
   When I create the Comment "new comment"
   Then the Comment should be created as "comment" 
  Given the Photo Id "photo id2" of the Comment "comment"
   Then the Id "photo id2" should equal the Id "photo id"
  Given the Comment Id "id" of the Comment "comment"
   When I get the Comment "id"
   Then I should get the Comment "comment"
    And the Comment "comment" should include the Comment "new comment"

Scenario: Creating an existing Comment
  Given an existing Comment Id "id"
   When I get the Comment "id"
   Then I should get the Comment "comment"
   When I create the Comment "comment"
   Then the Comment should not be created

Scenario: Updating a Comment
  Given an existing Comment Id "id"
    And a new Comment "updated comment"
   When I update the Comment "id" with "updated comment" 
   Then the Comment should be updated as "comment"
    And the Comment "comment" should include the Comment "updated comment"
  Given the Photo Id "photo id2" of the Comment "comment"
   Then the Id "photo id2" should equal the Id "photo id"
   When I get the Comment "id"
   Then I should get the Comment "comment"
    And the Comment "comment" should include the Comment "updated comment"

Scenario: Updating an unknown Comment 
  Given an unknown Comment Id "id"
    And a new Comment "updated comment"
   When I update the Comment "id" with "updated comment" 
   Then the resource should not be found

Scenario: Replacing a Comment
  Given an existing Comment Id "id"
    And a new Comment "replaced comment"
   When I replace the Comment "id" with "replaced comment" 
   Then the Comment should be replaced as "comment"
    And the Comment "comment" should include the Comment "replaced comment"
  Given the Photo Id "photo id2" of the Comment "comment"
   Then the Id "photo id2" should equal the Id "photo id"
   When I get the Comment "id"
   Then I should get the Comment "comment"
    And the Comment "comment" should include the Comment "replaced comment"

Scenario: Replacing an unknown Comment 
  Given an unknown Comment Id "id"
    And a new Comment "replaced comment"
   When I replace the Comment "id" with "replaced comment" 
   Then the resource should not be found

Scenario: Deleting a Comment
  Given a new Comment "deleted comment" 
    And I create the Comment "deleted comment"
    And the Comment should be created as "comment" 
  Given the Comment Id "id" of the Comment "comment"
   When I delete the Comment "id"
   Then the resource should be deleted
   When I get the Comment "id"
   Then the resource should not be found

Scenario: Deleting an unknown Comment
  Given an unknown Comment Id "id"
   When I delete the Comment "id"
   Then the resource should not be found
