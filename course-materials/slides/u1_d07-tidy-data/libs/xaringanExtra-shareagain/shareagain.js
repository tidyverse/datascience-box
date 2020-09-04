/* global slideshow,ClipboardJS */
(function () {
  function inIframe () {
    try {
      return window.self !== window.top
    } catch (e) {
      return true
    }
  }

  if (!inIframe()) return

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

  ready(addShareAgainBar)

  function addShareAgainBar () {
    const icons = {
      left: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="arrow-left w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>',
      right: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="arrow-right w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>',
      fullScreen: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="arrows-expand w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>',
      share: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="share w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>'
    }

    function getAuthor () {
      let author = document.head.querySelector('meta[name="author"]')

      if (author) {
        author = author.content + ' — '
      } else {
        author = ''
      }
      return author
    }

    function truncate (str, n, useWordBoundary = true) {
      if (str.length <= n) { return str }
      const subString = str.substr(0, n - 1)
      return (useWordBoundary
        ? subString.substr(0, subString.lastIndexOf(' '))
        : subString) + '&hellip;'
    };

    function getShortTitle () {
      return truncate(window.document.title || '', 50)
    }

    const navbar = document.createElement('nav')
    navbar.classList.add('shareagain-bar')

    navbar.innerHTML += `<ul class="slideInUp">
    <li class="shareagain-buttons">
      <button type="button" class="shareagain-button" id="shareagain-slide-prev" title="Next Slide">${icons.left}</button>
      <button type="button" class="shareagain-button" id="shareagain-slide-next" title="Previous Slide">${icons.right}</button>
    </li>
    <li class="shareagain-title" title="${getAuthor()}${window.document.title || ''}">${getShortTitle()}</li>
    <li class="shareagain-buttons">
      <button type="button" class="shareagain-button" id="shareagain-fullscreen" title="View in Full Screen">${icons.fullScreen}</button>
      <button type="button" class="shareagain-button" id="shareagain-share" title="Share">${icons.share}</button>
      <div class="shareon">
        <button class="link" href="${document.URL}" title="Copy Direct Link" data-clipboard-text="${document.URL}"></button>
        <a class="twitter" title="Share on Twitter"></a>
        <a class="facebook" title="Share on Facebook"></a>
        <a class="linkedin" title="Share on Linkedin"></a>
        <a class="pinterest" title="Share on Pinterest"></a>
        <a class="pocket" title="Save to Pocket"></a>
        <a class="reddit" title="Share on Reddit"></a>
      </div>
    </li>
    </ul>`

    const slidesContainer = document.querySelector(':not(html).remark-container')
    slidesContainer.appendChild(navbar)

    const btnSlidePrev = document.getElementById('shareagain-slide-prev')
    const btnSlideNext = document.getElementById('shareagain-slide-next')

    function toggleSlideButtons (slideIndex) {
      if (typeof slideIndex === 'undefined') {
        slideIndex = slideshow.getCurrentSlideIndex()
      }

      // Toggle next slide button
      if (slideIndex + 1 === slideshow.getSlideCount()) {
        btnSlideNext.classList.add('disabled')
        btnSlideNext.setAttribute('disabled', true)
      } else {
        btnSlideNext.classList.remove('disabled')
        btnSlideNext.removeAttribute('disabled')
      }

      // Toggle prev slide button
      if (slideIndex === 0) {
        btnSlidePrev.classList.add('disabled')
        btnSlidePrev.setAttribute('disabled', true)
      } else {
        btnSlidePrev.classList.remove('disabled')
        btnSlidePrev.removeAttribute('disabled')
      }
    }

    setTimeout(toggleSlideButtons, 100)

    // button click events
    btnSlidePrev.addEventListener('click', function (ev) {
      slideshow.gotoPreviousSlide()
    })

    btnSlideNext.addEventListener('click', function (ev) {
      slideshow.gotoNextSlide()
    })

    // button touch events (block remarkjs slide change on touch)
    btnSlidePrev.addEventListener('touchend', function (ev) {
      slideshow.gotoPreviousSlide()
      ev.stopPropagation()
    })

    btnSlideNext.addEventListener('touchend', function (ev) {
      slideshow.gotoNextSlide()
      ev.stopPropagation()
    });

    // show/hide share buttons
    ['click', 'touchend'].map(function (evType) {
      document.getElementById('shareagain-share').addEventListener(evType, function (ev) {
        toggleShareButtons()
        ev.preventDefault()
        ev.stopPropagation()
      })
    })

    navbar.addEventListener('touchend', function (ev) {
      ev.preventDefault()
      ev.stopPropagation()
    })

    // copy slides link to clipboard
    const shareClip = new ClipboardJS('.shareon .link')
    shareClip.on('success', function (e) {
      const el = document.querySelector('.shareon .link')
      el.classList.add('success')
      setTimeout(() => el.classList.remove('success'), 2500)
    })

    slideshow.on('afterShowSlide', function (slide) {
      toggleSlideButtons(slide.getSlideIndex())
    })

    function toggleAnimated ({ selector, show, inClass, outClass }) {
      const el = document.querySelector(selector)
      const isShown = el.classList.contains(inClass)
      if (typeof show === 'undefined') {
        show = !isShown
      }
      if (show === isShown) {
        return
      }
      if (show) {
        el.classList.remove(outClass)
        el.classList.add(inClass)
      } else {
        el.classList.remove(inClass)
        el.classList.add(outClass)
      }
    }

    let isCurrentlyFullScreen = false
    document.addEventListener('fullscreenchange', (event) => {
      if (document.fullscreenElement) {
        stopAutoHide(false)
        isCurrentlyFullScreen = true
      } else {
        isCurrentlyFullScreen = false
        startAutoHide()
      }
    })

    function toggleNavBar (show) {
      // do nothing if currently fullscreen
      if (isCurrentlyFullScreen) return

      toggleAnimated({ selector: '.shareagain-bar ul', show, inClass: 'slideInUp', outClass: 'slideOutDown' })
      if (!show) toggleShareButtons(false)
    }

    function toggleShareButtons (show) {
      toggleAnimated({ selector: '.shareagain-bar .shareon', show, inClass: 'slideInRight', outClass: 'slideOutRight' })
    }

    // auto hide the share bar when focus is in the slides
    let mouseMoveTimer = null
    function hideNavDelayed (ev) {
      if (mouseMoveTimer) {
        clearTimeout(mouseMoveTimer)
      }
      toggleNavBar(true)
      mouseMoveTimer = setTimeout(function () { toggleNavBar(false) }, 2000)
    };

    // toggle toggle full screen
    ['click', 'touchend'].map(function (evType) {
      document.getElementById('shareagain-fullscreen').addEventListener(evType, function (ev) {
        slideshow.toggleFullscreen()
        ev.stopPropagation()
      })
    })

    function startAutoHide () {
      hideNavDelayed()
      slidesContainer.addEventListener('mousemove', hideNavDelayed)
    }

    function stopAutoHide (showAfter = false) {
      slidesContainer.removeEventListener('mousemove', hideNavDelayed)
      clearTimeout(mouseMoveTimer)
      toggleNavBar(showAfter)
    }

    // auto hide turns on when the mouse comes into the slides area
    slidesContainer.addEventListener('mouseenter', function () {
      startAutoHide()
    })

    // turn off auto hide when the mouse leaves the slides area
    slidesContainer.addEventListener('mouseleave', function () {
      stopAutoHide(true)
    });

    // turn off auto hide if the mouse or focus is in the share bar
    ['focusin', 'mouseenter'].map(function (evType) {
      navbar.addEventListener(evType, function () {
        stopAutoHide(true)
      })
    });

    // and turn auto hide back on whne the mouse leaves the share bar
    // (if mouse exits out of the slides area, the slidesContainer should fire later)
    ['focusout', 'mouseleave'].map(function (evType) {
      navbar.addEventListener(evType, function () {
        startAutoHide()
      })
    })
  }
})()
