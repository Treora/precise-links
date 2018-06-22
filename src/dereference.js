import { selectorToRange } from 'dom-anchor-selector'
import { uriToSpecificResource } from 'selector-state-frags'
import scrollIntoView from 'scroll-into-view'

window.addEventListener('load', processWindowLocation)
window.addEventListener('hashchange', processWindowLocation)

function processWindowLocation() {
    const uri = window.location.href
    const specificResource = uriToSpecificResource(uri)
    if (specificResource.selector) {
        let range
        try {
            range = selectorToRange(specificResource.selector)
        } catch (err) {
            // Probably an unsupported selector type. Ignore it.
            return
        }

        const element = range.startContainer.parentElement
        scrollIntoView(element, {time: 200})

        window.getSelection().addRange(range)
    }
}
