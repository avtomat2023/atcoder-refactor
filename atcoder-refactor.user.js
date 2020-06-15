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
// - Save variable name mapping in localStorage

(function() {
    'use strict';

    const ID_ATTR = 'data-atcoder-refactor-id';

    const isAlpha = str => str.match(/^[A-Za-z]+$/);

    const rewriteVariables = id => {
        // TODO: Use current variable name instead of id
        const newName = prompt('Variable Name', id);
        document.querySelectorAll(`[${ID_ATTR}=${id}]`).forEach(varElem => {
            varElem.textContent = newName;
        })
    }

    // TODO: Use MathJax hook instead of wait 1000ms
    setTimeout(() => {
        document.querySelectorAll('.mjx-char').forEach(varElem => {
            const varId = varElem.textContent;
            if (!isAlpha(varId)) {
                return;
            }

            varElem.setAttribute(ID_ATTR, varId);
            varElem.onclick = () => rewriteVariables(varId);
        });
    }, 1000);
})();
