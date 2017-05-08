import { selectorToRange } from 'dom-anchor-selector'
import { uriToSpecificResource } from 'selector-state-frags'
import scrollIntoView from 'scroll-into-view'

window.onload = processWindowLocation
window.onhashchange = processWindowLocation

function processWindowLocation() {
    const uri = window.location.href
    const specificResource = uriToSpecificResource(uri)
    if (specificResource.selector) {
        const range = selectorToRange(specificResource.selector)

        const element = range.startContainer.parentElement
        scrollIntoView(element, {time: 200})

        window.getSelection().addRange(range)
    }
}
