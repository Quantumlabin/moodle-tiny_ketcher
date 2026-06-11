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
 * Dialog handling for the Moodle tiny_ketcher plugin.
 *
 * @module      tiny_ketcher/embed
 * @copyright   2024 Venkatesan Rangarajan <venkatesanrpu@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {get_string as getString} from 'core/str';
import {exception as displayException} from 'core/notification';
import {component} from './common';
import {getKetcherUrl} from './options';

export const openKetcherDialog = async(editor, currentStructBase64 = null) => {
    const [title, cancelText, saveText] = await Promise.all([
        getString('buttontitle', component),
        getString('cancel', component),
        getString('save', component),
    ]);

    const ketcherUrl = getKetcherUrl(editor);

    if (!ketcherUrl) {
        displayException(new Error('Ketcher URL is not configured.'));
        return;
    }

    const dialogConfig = {
        title: title,
        body: {
            type: 'panel',
            items: [
                {
                    type: 'htmlpanel',
                    html: `<iframe id="ketcher-iframe" src="${ketcherUrl}"` +
                        ` style="width: 100%; height: 500px; border: none;"></iframe>`
                }
            ]
        },
        size: 'large',
        buttons: [
            {
                type: 'cancel',
                name: 'cancel',
                text: cancelText
            },
            {
                type: 'submit',
                name: 'save',
                text: saveText,
                primary: true
            }
        ],
        onSubmit: async(api) => {
            const iframe = document.getElementById('ketcher-iframe');
            if (!iframe || !iframe.contentWindow || !iframe.contentWindow.ketcher) {
                window.console.error('Ketcher is not loaded.');
                api.close();
                return;
            }

            const ketcher = iframe.contentWindow.ketcher;

            try {
                const struct = await ketcher.getKet();

                if (!struct || (typeof struct === 'string' && struct.trim() === '')) {
                    api.close();
                    return;
                }

                const imageBlob = await ketcher.generateImage(struct, {
                    outputFormat: "svg",
                    backgroundColor: "255, 255, 255"
                });

                const reader = new FileReader();
                reader.onload = () => {
                    const base64Image = reader.result;

                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(atob(base64Image.split(',')[1]), "image/svg+xml");
                    const svgElement = svgDoc.documentElement;
                    const width = svgElement.getAttribute("width") || "300";
                    const height = svgElement.getAttribute("height") || "300";

                    const ketStructBase64 = btoa(JSON.stringify(struct));
                    const url = URL.createObjectURL(imageBlob);
                    const content = `<img src="${url}" width="${width}" height="${height}"` +
                        ` data-ketcher-struct="${ketStructBase64}" class="ketcher-molecule" alt="Chemical Structure">`;

                    editor.insertContent(content);
                    api.close();
                };
                reader.readAsDataURL(imageBlob);
            } catch (error) {
                displayException(error);
            }
        }
    };

    editor.windowManager.open(dialogConfig);

    if (currentStructBase64) {
        let attempts = 0;
        const maxAttempts = 50;
        const checkKetcher = setInterval(() => {
            attempts++;
            const iframe = document.getElementById('ketcher-iframe');
            if (iframe && iframe.contentWindow && iframe.contentWindow.ketcher) {
                clearInterval(checkKetcher);
                try {
                    const struct = JSON.parse(atob(currentStructBase64));
                    iframe.contentWindow.ketcher.setMolecule(struct);
                } catch (e) {
                    window.console.error("Failed to load existing molecule data.", e);
                }
            } else if (attempts >= maxAttempts) {
                clearInterval(checkKetcher);
                window.console.warn("Timeout waiting for Ketcher to load in iframe.");
            }
        }, 100);
    }
};
