@editor @editor_tiny @tiny @tiny_ketcher
Feature: Use the Ketcher chemical structure editor in TinyMCE
  In order to insert chemical structures into content
  As a teacher
  I need the Ketcher editor button to be available in the TinyMCE toolbar

  @javascript
  Scenario: The Ketcher button appears in the TinyMCE toolbar
    Given I log in as "admin"
    When I open my profile in edit mode
    And I expand all toolbars for the "Description" TinyMCE editor
    Then "Ketcher Editor" "button" should exist
