import { selectorToRange } from 'dom-anchor-selector'
import { uriToSelector } from 'selector-state-frags'
import scrollIntoView from 'scroll-into-view'

window.onload = processWindowLocation
window.onhashchange = processWindowLocation

function processWindowLocation() {
    const uri = window.location.href
    const selector = uriToSelector(uri)
    if (selector) {
        const range = selectorToRange(selector.selector)

        const element = range.startContainer.parentElement
        scrollIntoView(element, {time: 200})

        window.getSelection().addRange(range)
    }
}
