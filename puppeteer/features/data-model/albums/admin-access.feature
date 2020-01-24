Feature: Admin access : Albums

  As an administrator
  I want to access the Albums

Background:
  Given I am an administrator
    And I am identified

Scenario: Getting the Album list
   When I get the Album list
   Then I should get the complete Album list

Scenario: Reading an Album
  Given an existing Album Id "id"
   When I get the Album "id"
   Then I should get the Album "album"
  Given the Album Id "id2" of the Album "album"
   Then the Id "id2" should equal the Id "id"

Scenario: Reading an unknown Album
  Given an unknown Album Id "id"
   When I get the Album "id"
   Then the resource should not be found

Scenario: Creating an Album
  Given a new Album "new album" 
   When I create the Album "new album"
   Then the Album should be created as "album" 
    And the Album "new album" should equal the Album "album"
  Given the Album Id "id" of the Album "album"
   When I get the Album "id"
   Then I should get the Album "album"
    And the Album "new album" should equal the Album "album"

Scenario: Creating an existing Album
  Given an existing Album Id "id"
   When I get the Album "id"
   Then I should get the Album "album"
   When I create the Album "album"
   Then the Album should not be created

Scenario: Updating an Album
  Given an existing Album Id "id"
    And a new Album "updated album"
   When I update the Album "id" with "updated album" 
   Then the Album should be updated as "album"
    And the Album "album" should include the Album "updated album"
   When I get the Album "id"
   Then I should get the Album "album"
    And the Album "album" should include the Album "updated album"

Scenario: Updating an unknown Album 
  Given an unknown Album Id "id"
    And a new Album "updated album"
   When I update the Album "id" with "updated album" 
   Then the resource should not be found

Scenario: Replacing an Album
  Given an existing Album Id "id"
    And a new Album "replaced album"
   When I replace the Album "id" with "replaced album" 
   Then the Album should be replaced as "album"
    And the Album "album" should equal the Album "replaced album"
   When I get the Album "id"
   Then I should get the Album "album"
    And the Album "album" should equal the Album "replaced album"

Scenario: Replacing an unknown Album 
  Given an unknown Album Id "id"
    And a new Album "replaced album"
   When I replace the Album "id" with "replaced album" 
   Then the resource should not be found

Scenario: Deleting an Album
  Given a new Album "deleted album" 
    And I create the Album "deleted album"
    And the Album should be created as "album" 
  Given the Album Id "id" of the Album "album"
   When I delete the Album "id"
   Then the resource should be deleted
   When I get the Album "id"
   Then the resource should not be found

Scenario: Deleting an unknown Album
  Given an unknown Album Id "id"
   When I delete the Album "id"
   Then the resource should not be found
