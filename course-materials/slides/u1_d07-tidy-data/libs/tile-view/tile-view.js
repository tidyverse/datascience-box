/*
 *  Tile View for remark.js Slides
 *
 *  Garrick Aden-Buie
 *
 *  Inspired and converted to Vanilla JS from
 *  https://github.com/StephenHesperus/remark-hook/
 *
 *  Include after remarkjs slides are initialized.
 *
 */

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
    const launchKey = 79 // keycode for O, used to enable tile view

    // Slides container
    const remarkSlideShow = document.querySelector('div.remark-slides-area')

    let tileView = document.querySelector('div.remark__tile-view')
    if (!tileView) {
      tileView = document.createElement('div')
      tileView.className = 'remark__tile-view'
    }

    const toggleElement = el => {
      el.style.display = el.style.display === 'none' ? '' : 'none'
    }

    const toggleTileView = function () {
      toggleElement(tileView)
      toggleElement(remarkSlideShow)

      if (tileView.style.display === 'none') {
        // tileView is now hidden, go to current slide
        slideshow.gotoSlide(tileVars.currentSlideIdx + 1)

        // remove scroll/mousewheel event blocking
        tileView.removeEventListener('mousewheel', blockEvent)
        tileView.removeEventListener('DOMMouseScroll', blockEvent)
        console.log('removing blockScaling')
        document.removeEventListener('keydown', blockScaling)
      } else {
        // store current slide index prior to launching tile-view
        tileVars.currentSlideIdx = slideshow.getCurrentSlideIndex()

        // set class on seen and current slide and scroll into view
        const tiles = tileView.querySelectorAll('.remark__tile-view__tile');
        [...tiles].forEach((tile, idx) => {
          tile.classList.toggle(
            'remark__tile-view__tile--seen',
            idx < tileVars.currentSlideIdx
          )
          tile.classList.toggle(
            'remark__tile-view__tile--current',
            idx === tileVars.currentSlideIdx
          )
        })
        tiles[tileVars.currentSlideIdx].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })

        // block remarkjs from handling scroll events
        tileView.addEventListener('mousewheel', blockEvent)
        tileView.addEventListener('DOMMouseScroll', blockEvent)
        console.log('adding blockScaling')
        document.addEventListener('keydown', blockScaling)
      }
    }

    const createTileView = ({ minSize = 250, title = document.title } = {}) => {
      // Tile view header
      const h1 = document.createElement('h1')
      h1.className = 'remark__tile-view__header'
      h1.innerHTML = title

      tileView.appendChild(h1)
      const tiles = document.createElement('div')
      tiles.className = 'remark__tile-view__tiles'
      tileView.appendChild(tiles)

      // Clone slideshow
      const slidesArea = remarkSlideShow.cloneNode(true)

      // Calculate slide scale and tile container size
      const slideScaler = slidesArea.querySelector('.remark-slide-scaler')
      const slideWidth = parseFloat(slideScaler.style.width.replace('px', ''))
      const slideHeight = parseFloat(
        slideScaler.style.height.replace('px', '')
      )
      const scale = minSize / Math.min(slideWidth, slideHeight)
      let tileWidth = Math.round(slideWidth * scale)
      let tileHeight = Math.round(slideHeight * scale)

      // convert tileWidth/Height to em relative to base 18px (set in CSS)
      tileWidth = tileWidth / 18
      tileHeight = tileHeight / 18

      tiles.style.gridTemplateColumns = `repeat(auto-fill, minmax(${tileWidth}em, 1fr))`

      const slides = slidesArea.querySelectorAll('.remark-slide-container')

      slides.forEach((slide, slideIndex) => {
        let tile = document.createElement('template')
        tile.innerHTML = `<div class="remark__tile-view__tile">
            <div class="remark__tile-view__slide-container">
            </div></div>`
        tile = tile.content.firstChild

        const tileContainer = tile.querySelector(
          '.remark__tile-view__slide-container'
        )
        tileContainer.style.width = `${tileWidth}em`
        tileContainer.style.height = `${tileHeight}em`

        const thisSlideScaler = slide.querySelector('.remark-slide-scaler')
        thisSlideScaler.style.top = '0px'
        thisSlideScaler.style.left = '0px'
        thisSlideScaler.style.transform = `scale(${scale})`
        thisSlideScaler.parentElement.classList.add('remark-visible')

        slide.addEventListener('click', () => {
          tileVars.currentSlideIdx = slideIndex
          toggleTileView()
        })

        tileContainer.appendChild(slide)
        tiles.appendChild(tile)
      })

      document.body.appendChild(tileView)
    }

    const tileVars = {}
    const blockEvent = ev => ev.stopPropagation()
    const blockScaling = function (ev) {
      if (ev.controlKey || ev.metaKey) {
        if (ev.key === '=' || ev.key === '-') {
          ev.preventDefault()
          console.log('window scaling is not allowed inside the tile overview')
        }
      }
    }

    document.addEventListener('keydown', ev => {
      if (ev.keyCode === launchKey) {
        toggleTileView()
      }
    })

    const addTileViewHelpText = () => {
      const helpTable = document.querySelector(
        '.remark-help-content table.light-keys'
      )
      if (!helpTable) {
        console.error(
          'Could not find remark help table, has remark been initialized?'
        )
        return
      }
      const newRow = document.createElement('tr')
      newRow.innerHTML += '<td><span class="key">o</span></td>'
      newRow.innerHTML += '<td>Tile View: Overview of Slides</td>'
      helpTable.append(newRow)
    }

    createTileView({ minSize: 200 })
    toggleElement(tileView)
    addTileViewHelpText()
  })
})()
