function fallbackCopyTextToClipboard(text) {
  return new Promise((resolve, reject) => {
    const scrollTop = document.documentElement.scrollTop
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    window.scrollTo(0, scrollTop)

    try {
      const result = !!document.execCommand('copy')
      if (!result) {
        reject(`execCommand('copy') returned false`)
      } else {
        resolve()
      }
    } catch (err) {
      reject(err)
    }
    document.body.removeChild(textArea)
  })
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text)
  }
  return navigator.clipboard.writeText(text)
}

function showIndicator(target, className) {
  const cn = `copy-${className}`
  target.classList.add(cn)

  setTimeout(() => {
    target.classList.remove(cn)
  }, 1000)
}

function showSuccess(target) {
  showIndicator(target, 'success')
}

function showFailed(target) {
  showIndicator(target, 'failed')
}

function copyOnClickHandler(event) {
  const evTarget = event.target
  const target = evTarget.tagName === 'SPAN' && evTarget.parentElement.tagName === 'TD' ? evTarget.parentElement : evTarget
  if (!target.tagName === 'TD') {
    return
  }
  if (!target.innerHTML) {
    return
  }
  const text = target.textContent
  copyTextToClipboard(text)
    .then(() => {
      showSuccess(target)
    })
    .catch(err => {
      console.error('special-characters: Unable to copy', err)
      showFailed(target)
    })
}

const tables = document.querySelectorAll('table')
tables.forEach(table => {
  table.addEventListener('click', copyOnClickHandler)
  table.setAttribute('title', 'Кликните мышкой на ячейку, чтобы скопировать')
})
