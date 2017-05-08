import { rangeToSelector } from 'dom-anchor-selector'
import { specificResourceToUri } from 'selector-state-frags'

function createHtmlQuote({range, uri}) {
    const selectedContent = range.cloneContents()
    // TODO: inline styles&images, wrap in common ancestor(s), resolve relative URLs

    const blockQuoteEl = document.createElement('blockquote')

    const quoteEl = document.createElement('q')
    quoteEl.appendChild(selectedContent)
    quoteEl.setAttribute('cite', uri)

    const citeEl = document.createElement('cite')
    citeEl.style = 'vertical-align: super; margin-left: 0.5em;'

    const aEl = document.createElement('a')
    aEl.setAttribute('href', uri)
    aEl.innerHTML = '[source]'

    citeEl.appendChild(aEl)
    blockQuoteEl.appendChild(quoteEl)
    blockQuoteEl.appendChild(citeEl)

    // Append a <br /> so editors do not put the cursor inside the blockquote.
    const html = blockQuoteEl.outerHTML + '<br />'
    return html
}

function copy(event) {
    event.preventDefault()

    const selection = window.getSelection()
    if (selection.rangeCount == 0) return

    const range = selection.getRangeAt(0);
    if (range.collapsed) return

    const selector = rangeToSelector(range, document.body)

    const documentUri = document.location.href.split('#')[0]
    const specificResource = {
        '@context': 'http://www.w3.org/ns/oa.jsonld',
        type: 'SpecificResource',
        source: documentUri,
        selector,
    }

    const data = JSON.stringify(specificResource)
    event.clipboardData.setData('application/ld+json', data)
    event.clipboardData.setData('text/plain', selection.toString())

    const targetUri = specificResourceToUri(specificResource)
    event.clipboardData.setData('text/uri-list', targetUri)

    const html = createHtmlQuote({range, uri: targetUri})

    event.clipboardData.setData('text/html', html)
}

document.addEventListener('copy', copy)


// DEBUG
document.addEventListener('paste', paste)
function paste(event) {
    console.log(event.clipboardData.getData('text/plain'))
    console.log(event.clipboardData.getData('application/ld+json'))
    console.log(event.clipboardData.getData('text/html'))
}
