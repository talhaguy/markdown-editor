// to get past the following error due to jsdom being an incomplete environment:
// Error: Uncaught [TypeError: range(...).getBoundingClientRect is not a function]
// from https://github.com/jsdom/jsdom/issues/3002
document.createRange = () => {
    const range = new Range()

    range.getBoundingClientRect = jest.fn()

    range.getClientRects = () => {
        return {
            item: () => null,
            length: 0,
            [Symbol.iterator]: jest.fn(),
        }
    }

    return range
}

// to get past the following error due to jsdom being an incomplete environment:
// Error: Not implemented: window.focus
window.focus = jest.fn()
