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

    const identifyPanelName = (item) => {
      let name = 'Panel'

      // If the item doesn't have a parent element, then we've already processed
      // it, probably because we're in an Rmd, and it's been removed from the DOM
      if (!item.parentElement) {
        return
      }

      // In R Markdown when header-attrs.js is present, we may have found a
      // section header but the class attributes won't be duplicated on the <hX> tag
      if (
        (item.tagName === 'SECTION' || item.classList.contains('section')) &&
        /^H[1-6]/.test(item.children[0].tagName)
      ) {
        name = item.children[0].textContent
        item.classList.remove('panel-name')
        item.removeChild(item.children[0])
        return name
      }

      const nameDiv = item.querySelector('.panel-name')
      if (!nameDiv) return name

      // In remarkjs the .panel-name span might be in a paragraph tag
      // and if the <p> is empty, we'll remove it
      if (
        nameDiv.tagName === 'SPAN' &&
        nameDiv.parentNode.tagName === 'P' &&
        nameDiv.textContent === nameDiv.parentNode.textContent
      ) {
        name = nameDiv.textContent
        item.removeChild(nameDiv.parentNode)
        return name
      }

      // If none of the above, remove the nameDiv and return the name
      name = nameDiv.textContent
      nameDiv.parentNode.removeChild(nameDiv)
      return name
    }

    const processPanelItem = (item) => {
      const name = identifyPanelName(item)
      if (!name) {
        return null
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

    /*
     * Update selected panel for panelset or delete panelset from query string
     *
     * @param panelset Panelset ID to update in the search params
     * @param panel Panel ID of selected panel in panelset, or null to delete from search params
     * @param params Current params object, or params from window.location.search
     */
    function updateSearchParams (panelset, panel, params = new URLSearchParams(window.location.search)) {
      if (panel) {
        params.set(panelset, panel)
      } else {
        params.delete(panelset)
      }
      return params
    }

    /*
     * Update the URL to match params
     */
    const updateUrl = (params) => {
      if (typeof params === 'undefined') return
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

      // emit window resize event to trick html widgets into fitting to the panel width
      window.dispatchEvent(new Event('resize'))

      // update query string
      const params = updateSearchParams(panelClicked, panelTabClicked)
      updateUrl(params)
    }

    const initPanelSet = (panelset, idx) => {
      let panels = Array.from(panelset.querySelectorAll('.panel'))
      if (!panels.length && panelset.matches('.section[class*="level"]')) {
        // we're in tabset-alike R Markdown
        const panelsetLevel = [...panelset.classList]
          .filter(s => s.match(/^level/))[0]
          .replace('level', '')

        // move children that aren't inside a section up above the panelset
        Array.from(panelset.children).forEach(function (el) {
          if (el.matches('div.section[class*="level"]')) return
          panelset.parentElement.insertBefore(el, panelset)
        })

        // panels are all .sections with .level<panelsetLevel + 1>
        const panelLevel = +panelsetLevel + 1
        panels = Array.from(panelset.querySelectorAll(`.section.level${panelLevel}`))
      }

      if (!panels.length) return

      const contents = panels.map(processPanelItem).filter(o => o !== null)
      const newPanelSet = reflowPanelSet(contents, idx)
      newPanelSet.classList = panelset.classList
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
        const params = [...document.querySelectorAll('.remark-visible .panelset')]
          .reduce(function (params, panelset) {
            return updateSearchParams(panelset.id, null, params)
          }, new URLSearchParams(window.location.search))

        updateUrl(params)
      })

      slideshow.on('afterShowSlide', slide => {
        const slidePanels = getVisibleActivePanelInfo()

        if (slidePanels) {
          // only first panel gets focus
          slidePanels[0].panel.focus()
          // but still update the url to reflect all active panels
          const params = slidePanels.reduce(
            function (params, { panelId, panelSetId }) {
              return updateSearchParams(panelSetId, panelId, params)
            },
            new URLSearchParams(window.location.search)
          )
          updateUrl(params)
        }
      })
    }
  })
})()
