// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Commands for the Moodle tiny_ketcher plugin.
 *
 * @module      tiny_ketcher/commands
 * @copyright   2024 Venkatesan Rangarajan <venkatesanrpu@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import { getButtonImage } from 'editor_tiny/utils';
import { get_string as getString } from 'core/str';
import { component, icon, buttonName } from './common';
import { openKetcherDialog } from './embed';

const isKetcherImage = (node) => node.nodeName.toLowerCase() === 'img' && node.hasAttribute('data-ketcher-struct');

const handleAction = (editor) => {
    let currentStruct = null;
    const node = editor.selection.getNode();
    if (isKetcherImage(node)) {
        currentStruct = node.getAttribute('data-ketcher-struct');
    }
    openKetcherDialog(editor, currentStruct);
};

export const getSetup = async() => {
    const [
        buttonNameTitle,
        buttonImage,
    ] = await Promise.all([
        getString('buttontitle', component),
        getButtonImage('icon', component),
    ]);

    return (editor) => {
        editor.ui.registry.addIcon(icon, buttonImage.html);

        editor.ui.registry.addButton(buttonName, {
            icon,
            tooltip: buttonNameTitle,
            onAction: () => handleAction(editor),
        });

        editor.ui.registry.addContextToolbar(`${buttonName}Context`, {
            predicate: isKetcherImage,
            items: buttonName,
            position: 'node',
            scope: 'node'
        });

        editor.ui.registry.addMenuItem(buttonName, {
            icon,
            text: buttonNameTitle,
            onAction: () => handleAction(editor),
        });
    };
};
