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

function createHtmlLink(uri) {
    return `<a href="${uri}">${uri}</a>`
}

function copy({clipboardData, copyLink}) {
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
    clipboardData.setData('application/ld+json', data)

    const targetUri = specificResourceToUri(specificResource)
    clipboardData.setData('text/uri-list', targetUri)

    if (copyLink) {
        // Copy the link to the selection, not the contents
        clipboardData.setData('text/plain', targetUri)
        clipboardData.setData('text/markdown', `[${targetUri}](${targetUri})`)

        const html = createHtmlLink(targetUri)
        clipboardData.setData('text/html', html)
    } else {
        // Copy selection contents
        const text = selection.toString()
        clipboardData.setData('text/plain', text)
        clipboardData.setData('text/markdown', `[${text}](${targetUri})`)

        const html = createHtmlQuote({range, uri: targetUri})
        clipboardData.setData('text/html', html)
    }
}

let copyLink = false
function handleCopy(event) {
    event.preventDefault()

    copy({
        clipboardData: event.clipboardData,
        copyLink,
    })
}

document.addEventListener('copy', handleCopy)

browser.runtime.onMessage.addListener(message => {
    if (message.type === 'copyLinkToSelection') {
        copyLink = true
        document.execCommand('copy')
        copyLink = false
    }
})


// DEBUG
document.addEventListener('paste', paste)
function paste(event) {
    console.log(event.clipboardData.getData('text/plain'))
    console.log(event.clipboardData.getData('application/ld+json'))
    console.log(event.clipboardData.getData('text/html'))
}
