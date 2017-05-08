browser.contextMenus.create({
    id: 'copyLinkToSelection',
    title: 'Copy link to selected text',
    contexts: ['selection'],
})

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == 'copyLinkToSelection') {
        const message = {
            type: 'copyLinkToSelection',
        }
        browser.tabs.sendMessage(tab.id, message)
    }
})
