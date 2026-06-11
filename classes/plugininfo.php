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

/**
 * Tiny Ketcher plugin info.
 *
 * @package    tiny_ketcher
 * @copyright  2024 Venkatesan Rangarajan <venkatesanrpu@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_ketcher;

use context;
use editor_tiny\editor;
use editor_tiny\plugin;
use editor_tiny\plugin_with_buttons;
use editor_tiny\plugin_with_configuration;
use editor_tiny\plugin_with_menuitems;

/**
 * Tiny Ketcher plugin info class.
 *
 * @package    tiny_ketcher
 * @copyright  2024 Venkatesan Rangarajan <venkatesanrpu@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class plugininfo extends plugin implements
    plugin_with_buttons,
    plugin_with_configuration,
    plugin_with_menuitems {
    /**
     * Returns a list of buttons this plugin provides.
     *
     * @return string[]
     */
    public static function get_available_buttons(): array {
        return [
            'tiny_ketcher/tiny_ketcher',
        ];
    }

    /**
     * Returns a list of menu items this plugin provides.
     *
     * @return string[]
     */
    public static function get_available_menuitems(): array {
        return [
            'tiny_ketcher/tiny_ketcher',
        ];
    }

    /**
     * Returns plugin configuration for a given context.
     *
     * @param context $context
     * @param array $options
     * @param array $fpoptions
     * @param editor|null $editor
     * @return array
     */
    public static function get_plugin_configuration_for_context(
        context $context,
        array $options,
        array $fpoptions,
        ?editor $editor = null
    ): array {
        return [
            'ketcherUrl' => (new \moodle_url('/lib/editor/tiny/plugins/ketcher/ketcher/index.html'))->out(false),
        ];
    }
}
