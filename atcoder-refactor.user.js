// ==UserScript==
// @name         atcoder-refactor
// @namespace    https://github.com/yoshrc
// @version      0.1
// @description  Rewrites variable names in AtCoder problem statements.
// @author       yoshrc
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// ==/UserScript==

// TODO
// - Inline edit like IDE's multiselection instead of popup
// - Use Roman font for multiple-character variable names

(function() {
    'use strict';

    const ID_ATTR = 'data-atcoder-refactor-id';

    const storage = (() => {
        const STORAGE_KEY_PREFIX = 'atcoder-refactor-';
        const contest = location.href.match(/^https:\/\/atcoder\.jp\/contests\/([^\/?]+)/)[1];
        const key = STORAGE_KEY_PREFIX + contest;

        // TODO: consider load failure in case that the problem statement is updated
        return {
            load: () => {
                const idToNameStr = localStorage[key];
                if (!idToNameStr) {
                    return null;
                } else {
                    return JSON.parse(idToNameStr);
                }
            },

            save: idToName => {
                localStorage[key] = JSON.stringify(idToName);
            }
        };
    })();

    // When handlers called, the following setups must be completed:
    // - for all varaible elements, ID_ATTR attribute must be set
    // - id-name mapping should be set in the storage
    const handlers = (() => {
        const forEachVariable = (id, operationOnElement) => {
            document.querySelectorAll(`[${ID_ATTR}=${id}]`).forEach(elem => {
                operationOnElement(elem);
            })
        };

        return {
            onclick: varElem => {
                const id = varElem.getAttribute(ID_ATTR);
                // TODO: Use current variable name instead of id
                // TODO: When an empty string is given, don't change the variable name
                const newName = prompt('Variable Name', id);
                forEachVariable(id, elem => {
                    elem.textContent = newName;
                });
                const idToName = storage.load();
                idToName[id] = newName;
                storage.save(idToName);
            }
        }
    })();

    // TODO: Use MathJax hook instead of wait 1000ms
    setTimeout(() => {
        const isVariable = mathJaxCharElem => mathJaxCharElem.textContent.match(/^[A-Za-z]+$/);
        const forEachVariable = operationOnElement => {
            document.querySelectorAll('.mjx-char').forEach(elem => {
                if (!isVariable(elem)) {
                    return;
                }
                operationOnElement(elem);
            })
        }

        const setupStorage = () => {
            const idToName = {};
            forEachVariable(elem => {
                const id = elem.textContent;
                idToName[id] = id;
            });
            storage.save(idToName);
        };

        const rewriteVariables = idToName => {
            forEachVariable(elem => {
                const id = elem.textContent;
                elem.textContent = idToName[id];
            });
        };

        forEachVariable(elem => {
            const id = elem.textContent;
            elem.setAttribute(ID_ATTR, id);
        });

        const idToName = storage.load();
        if (!idToName) {
            setupStorage();
        } else {
            rewriteVariables(idToName);
        }

        forEachVariable(elem => {
            elem.onclick = () => handlers.onclick(elem);
        });
    }, 1000);
})();
