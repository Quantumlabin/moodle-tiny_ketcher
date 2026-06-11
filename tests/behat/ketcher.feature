@editor @editor_tiny @tiny_ketcher
Feature: Use the Ketcher chemical structure editor in TinyMCE
  In order to insert chemical structures into content
  As a teacher
  I need to be able to open and use the Ketcher editor

  @javascript
  Scenario: The Ketcher button appears in the TinyMCE toolbar
    Given I log in as "admin"
    When I open my profile in edit mode
    And I expand all toolbars for the "Description" TinyMCE editor
    Then "Ketcher Editor" "button" should exist

  @javascript
  Scenario: Permissions can be configured to control access to Ketcher editor
    Given the following "users" exist:
      | username | firstname | lastname | email                |
      | teacher1 | Teacher   | 1        | teacher1@example.com |
      | teacher2 | Teacher   | 2        | teacher2@example.com |
    And the following "courses" exist:
      | fullname | shortname | format |
      | Course 1 | C1        | topics |
    And the following "roles" exist:
      | name           | shortname | description         | archetype      |
      | Custom teacher | custom1   | Limited permissions | editingteacher |
    And the following "course enrolments" exist:
      | user     | course | role           |
      | teacher1 | C1     | editingteacher |
      | teacher2 | C1     | custom1        |
    And the following "activity" exists:
      | activity | assign          |
      | course   | C1              |
      | name     | Test assignment |
    And the following "permission overrides" exist:
      | capability      | permission | role    | contextlevel | reference |
      | tiny/ketcher:use | Prohibit  | custom1 | Course       | C1        |
    When I am on the "Test assignment" "assign activity" page logged in as "teacher1"
    And I navigate to "Settings" in current page administration
    And I expand all toolbars for the "Activity instructions" TinyMCE editor
    Then "Ketcher Editor" "button" should exist
    And I log out
    When I am on the "Test assignment" "assign activity" page logged in as "teacher2"
    And I navigate to "Settings" in current page administration
    And I expand all toolbars for the "Activity instructions" TinyMCE editor
    Then "Ketcher Editor" "button" should not exist
