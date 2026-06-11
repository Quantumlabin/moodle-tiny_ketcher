<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

declare(strict_types=1);

namespace tiny_ketcher;

use advanced_testcase;
use context_system;

/**
 * Unit tests for the \tiny_ketcher\plugininfo class.
 *
 * @package     tiny_ketcher
 * @covers      \tiny_ketcher\plugininfo::get_plugin_configuration_for_context
 * @copyright   2024 Venkatesan Rangarajan <venkatesanrpu@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class plugininfo_test extends advanced_testcase {

    /**
     * Basic setup for tests.
     */
    public function setUp(): void {
        parent::setUp();
        $this->resetAfterTest(true);
    }

    /**
     * Test that get_plugin_configuration_for_context returns the ketcherUrl key.
     *
     * @return void
     */
    public function test_get_plugin_configuration_for_context_returns_ketcher_url(): void {
        $context = context_system::instance();
        $configuration = plugininfo::get_plugin_configuration_for_context($context, [], []);

        $this->assertArrayHasKey('ketcherUrl', $configuration);
        $this->assertNotEmpty($configuration['ketcherUrl']);
        $this->assertStringContainsString('ketcher/index.html', $configuration['ketcherUrl']);
    }

    /**
     * Test that get_available_buttons returns the expected button name.
     *
     * @return void
     */
    public function test_get_available_buttons(): void {
        $buttons = plugininfo::get_available_buttons();

        $this->assertIsArray($buttons);
        $this->assertContains('tiny_ketcher/tiny_ketcher', $buttons);
    }

    /**
     * Test that get_available_menuitems returns the expected menu item name.
     *
     * @return void
     */
    public function test_get_available_menuitems(): void {
        $menuitems = plugininfo::get_available_menuitems();

        $this->assertIsArray($menuitems);
        $this->assertContains('tiny_ketcher/tiny_ketcher', $menuitems);
    }
}
