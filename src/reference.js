import escapeHtml from 'escape-html'
import browser from 'webextension-polyfill'
import { rangeToSelector } from 'dom-anchor-selector'
import { specificResourceToUri } from 'selector-state-frags'

function copy({clipboardData}) {
    const selection = window.getSelection()
    if (selection.rangeCount == 0) return

    const range = selection.getRangeAt(0);
    if (range.collapsed) return

    const selector = rangeToSelector(range, document.body)

    const documentUri = document.location.href.split('#')[0]
    const specificResource = {
        '@context': 'http://www.w3.org/ns/anno.jsonld',
        type: 'SpecificResource',
        source: documentUri,
        selector,
    }

    const targetUri = specificResourceToUri(specificResource)

    clipboardData.setData('application/ld+json', JSON.stringify(specificResource))
    clipboardData.setData('text/uri-list', targetUri)
    clipboardData.setData('text/plain', targetUri)
    clipboardData.setData('text/markdown', `[${targetUri}](${targetUri})`)
    clipboardData.setData('text/html', `<a href="${escapeHtml(targetUri)}">${targetUri}</a>`)
}

function handleCopy(event) {
    event.preventDefault()
    copy({
        clipboardData: event.clipboardData,
    })
}

browser.runtime.onMessage.addListener(message => {
    if (message.type === 'copyLinkToSelection') {
        document.addEventListener('copy', handleCopy)
        document.execCommand('copy')
        document.removeEventListener('copy', handleCopy)
    }
})
