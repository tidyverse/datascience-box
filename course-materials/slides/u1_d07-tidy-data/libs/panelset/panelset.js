/* global slideshow */
(function () {
  const ready = function (fn) {
    /* MIT License Copyright (c) 2016 Nuclei */
    /* https://github.com/nuclei/readyjs */
    const completed = () => {
      document.removeEventListener('DOMContentLoaded', completed)
      window.removeEventListener('load', completed)
      fn()
    }
    if (document.readyState !== 'loading') {
      setTimeout(fn)
    } else {
      document.addEventListener('DOMContentLoaded', completed)
      window.addEventListener('load', completed)
    }
  }

  ready(function () {
    [...document.querySelectorAll('.panel-name')]
      .map(el => el.textContent.trim())

    const panelIds = {}

    const uniquePanelId = (name) => {
      name = encodeURIComponent(name.toLowerCase().replace(/[\s]/g, '-'))
      if (Object.keys(panelIds).includes(name)) {
        name += ++panelIds[name]
      } else {
        panelIds[name] = 1
      }
      return name
    }

    const processPanelItem = (item) => {
      const nameDiv = item.querySelector('.panel-name')
      let name = 'Panel'
      if (nameDiv) {
        name = nameDiv.textContent.trim()
        if (nameDiv.tagName === 'SPAN' && nameDiv.parentNode.tagName === 'P') {
          item.removeChild(nameDiv.parentNode)
        } else {
          item.removeChild(nameDiv)
        }
      }
      return { name, content: item.children, id: uniquePanelId(name) }
    }

    const getCurrentPanelFromUrl = (panelset) => {
      const params = new URLSearchParams(window.location.search)
      return params.get(panelset)
    }

    const reflowPanelSet = (panels, idx) => {
      const res = document.createElement('div')
      res.className = 'panelset'
      res.id = 'panelset' + (idx > 0 ? idx : '')
      const panelSelected = getCurrentPanelFromUrl(res.id)

      // create header row
      const headerRow = document.createElement('ul')
      headerRow.className = 'panel-tabs'
      headerRow.setAttribute('role', 'tablist')
      panels
        .map((p, idx) => {
          const panelHeaderItem = document.createElement('li')
          panelHeaderItem.className = 'panel-tab'
          panelHeaderItem.setAttribute('role', 'tab')
          const thisPanelIsActive = panelSelected ? panelSelected === p.id : idx === 0
          if (thisPanelIsActive) {
            panelHeaderItem.classList.add('panel-tab-active')
            panelHeaderItem.setAttribute('aria-selected', true)
          }
          panelHeaderItem.tabIndex = 0
          panelHeaderItem.id = res.id + '_' + p.id // #panelsetid_panelid

          const panelHeaderLink = document.createElement('a')
          panelHeaderLink.href = '?' + res.id + '=' + p.id + '#' + panelHeaderItem.id
          panelHeaderLink.setAttribute('onclick', 'return false;')
          panelHeaderLink.tabIndex = -1 // list item is tabable, not link
          panelHeaderLink.innerHTML = p.name
          panelHeaderLink.setAttribute('aria-controls', p.id)

          panelHeaderItem.appendChild(panelHeaderLink)
          return panelHeaderItem
        })
        .forEach(el => headerRow.appendChild(el))

      res.appendChild(headerRow)

      panels
        .map((p, idx) => {
          const panelContent = document.createElement('section')
          panelContent.className = 'panel'
          panelContent.setAttribute('role', 'tabpanel')
          const thisPanelIsActive = panelSelected ? panelSelected === p.id : idx === 0
          panelContent.classList.toggle('panel-active', thisPanelIsActive)
          panelContent.id = p.id
          panelContent.setAttribute('aria-labelledby', p.id)
          Array.from(p.content).forEach(el => panelContent.appendChild(el))
          return panelContent
        })
        .forEach(el => res.appendChild(el))

      return res
    }

    const updateUrl = (panelset, panel) => {
      let params = new URLSearchParams(window.location.search)
      if (panel) {
        params.set(panelset, panel)
      } else {
        params.delete(panelset)
      }
      params = params.toString() ? ('?' + params.toString()) : ''
      const { pathname, hash } = window.location
      const uri = pathname + params + hash
      window.history.replaceState(uri, '', uri)
    }

    const togglePanel = (clicked) => {
      if (clicked.nodeName.toUpperCase() === 'A') {
        clicked = clicked.parentElement
      }
      if (!clicked.classList.contains('panel-tab')) return
      if (clicked.classList.contains('panel-tab-active')) return

      const tabs = clicked.parentNode
        .querySelectorAll('.panel-tab')
      const panels = clicked.parentNode.parentNode
        .querySelectorAll('.panel')
      const panelTabClicked = clicked.children[0].getAttribute('aria-controls')
      const panelClicked = clicked.parentNode.parentNode.id

      Array.from(tabs)
        .forEach(t => {
          t.classList.remove('panel-tab-active')
          t.removeAttribute('aria-selected')
        })
      Array.from(panels)
        .forEach(p => {
          const active = p.id === panelTabClicked
          p.classList.toggle('panel-active', active)
          // make inactive panels inaccessible by keyboard navigation
          if (active) {
            p.removeAttribute('tabIndex')
            p.removeAttribute('aria-hidden')
          } else {
            p.setAttribute('tabIndex', -1)
            p.setAttribute('aria-hidden', true)
          }
        })

      clicked.classList.add('panel-tab-active')
      clicked.setAttribute('aria-selected', true)

      // update query string
      updateUrl(panelClicked, panelTabClicked)
    }

    const initPanelSet = (panelset, idx) => {
      const panels = Array.from(panelset.querySelectorAll('.panel'))
      if (!panels.length) return

      const contents = panels.map(processPanelItem)
      const newPanelSet = reflowPanelSet(contents, idx)
      panelset.parentNode.insertBefore(newPanelSet, panelset)
      panelset.parentNode.removeChild(panelset)

      // click and touch events
      const panelTabs = newPanelSet.querySelector('.panel-tabs');
      ['click', 'touchend'].forEach(eventType => {
        panelTabs.addEventListener(eventType, function (ev) {
          togglePanel(ev.target)
          ev.stopPropagation()
        })
      })
      panelTabs.addEventListener('touchmove', function (ev) {
        ev.preventDefault()
      })

      // key events
      newPanelSet
        .querySelector('.panel-tabs')
        .addEventListener('keydown', (ev) => {
          const self = ev.currentTarget.querySelector('.panel-tab-active')
          if (ev.code === 'Space' || ev.code === 'Enter') {
            togglePanel(ev.target)
            ev.stopPropagation()
          } else if (ev.code === 'ArrowLeft' && self.previousSibling) {
            togglePanel(self.previousSibling)
            self.previousSibling.focus()
            ev.stopPropagation()
          } else if (ev.code === 'ArrowRight' && self.nextSibling) {
            togglePanel(self.nextSibling)
            self.nextSibling.focus()
            ev.stopPropagation()
          }
        })

      return panels
    }

    // initialize panels
    Array.from(document.querySelectorAll('.panelset')).map(initPanelSet)

    if (typeof slideshow !== 'undefined') {
      const getVisibleActivePanelInfo = () => {
        const slidePanels = document.querySelectorAll('.remark-visible .panel-tab-active')

        if (!slidePanels.length) return null

        return slidePanels.map(panel => {
          return {
            panel,
            panelId: panel.children[0].getAttribute('aria-controls'),
            panelSetId: panel.parentNode.parentNode.id
          }
        })
      }

      slideshow.on('hideSlide', slide => {
        // clear focus if we had a panel-tab selected
        document.activeElement.blur()

        // clear search query for panelsets in current slide
        document.querySelectorAll('.remark-visible .panelset')
          .forEach(ps => updateUrl(ps.id, null))
      })

      slideshow.on('afterShowSlide', slide => {
        const slidePanels = getVisibleActivePanelInfo()

        if (slidePanels) {
          // only first panel gets focus
          slidePanels[0].panel.focus()
          // but still update the url to reflect all active panels
          slidePanels.forEach(({ panelId, panelSetId }) => updateUrl(panelSetId, panelId))
        }
      })
    }
  })
})()
