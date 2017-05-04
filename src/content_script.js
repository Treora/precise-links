import { selectorToRange } from 'dom-anchor-selector'
import { uriToSelector } from 'selector-state-frags'

window.onload = processWindowLocation
window.onhashchange = processWindowLocation

function processWindowLocation() {
    const uri = window.location.href
    const selector = uriToSelector(uri)
    if (selector) {
        const range = selectorToRange(selector.selector)
        window.getSelection().addRange(range)
    }
}
