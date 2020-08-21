var counters = {timer: {}};
var update_timer = function(timer, force = false) {
	var secs = timer.value;

	// check if we should update timer or not
	noup = timer.div.className.match(/noupdate-\d+/);
	if (!force && noup != null) {
	  noup = parseInt(noup[0].match(/\d+$/));
	  if (secs > noup * 2 && secs % noup > 0) { return; }
	}

	// should we apply or remove warning class?
	warnwhen = timer.div.dataset.warnwhen;
	if (warnwhen && warnwhen > 0) {
	  if (secs <= warnwhen && !timer.div.classList.contains("warning")) {
	    timer.div.classList.add("warning");
	  } else if (secs > warnwhen && timer.div.classList.contains("warning")) {
	    timer.div.classList.remove("warning");
	  }
	}

  var mins = Math.floor(secs / 60); // 1 min = 60 secs
  secs -= mins * 60;

  // Update HTML
  timer.min.innerHTML = String(mins).padStart(2, 0);
  timer.sec.innerHTML = String(secs).padStart(2, 0);
}
var countdown = function (e) {
  target = e.target;
  if (target.classList.contains("countdown-digits")) {
    target = target.parentElement;
  }
  if (target.tagName == "CODE") {
    target = target.parentElement;
  }

  // Init counter
  if (!counters.timer.hasOwnProperty(target.id)) {
    counters.timer[target.id] = {};
    // Set the containers
	  counters.timer[target.id].min = target.getElementsByClassName("minutes")[0];
  	counters.timer[target.id].sec = target.getElementsByClassName("seconds")[0];
  	counters.timer[target.id].div = target;
  }

  if (!counters.timer[target.id].running) {
    if (!counters.timer[target.id].end) {
      counters.timer[target.id].end   = parseInt(counters.timer[target.id].min.innerHTML) * 60;
		  counters.timer[target.id].end  += parseInt(counters.timer[target.id].sec.innerHTML);
    }

    counters.timer[target.id].value = counters.timer[target.id].end;
    update_timer(counters.timer[target.id]);
    if (counters.ticker) counters.timer[target.id].value += 1;

    // Start if not past end date
    if (counters.timer[target.id].value > 0) {
      base_class = target.className.replace(/\s?(running|finished)/, "")
      target.className = base_class + " running";
      counters.timer[target.id].running = true;

      if (!counters.ticker) {
        counters.ticker = setInterval(counter_update_all, 1000);
      }
    }
  } else {
    // Bump timer value if running & clicked
    counters.timer[target.id].value += counter_bump_increment(counters.timer[target.id].end);
    update_timer(counters.timer[target.id], force = true);
    counters.timer[target.id].value += 1;
  }
};

var counter_bump_increment = function(val) {
  if (val <= 30) {
    return 5;
  } else if (val <= 300) {
    return 15;
  } else if (val <= 3000) {
    return 30;
  } else {
    return 60;
  }
}

var counter_update_all = function() {
  // Iterate over all running timers
  for (var i in counters.timer) {
    // Stop if passed end time
    console.log(counters.timer[i].id)
    counters.timer[i].value--;
    if (counters.timer[i].value <= 0) {
      counters.timer[i].min.innerHTML = "00";
      counters.timer[i].sec.innerHTML = "00";
      counters.timer[i].div.className = counters.timer[i].div.className.replace("running", "finished");
      counters.timer[i].running = false;
    } else {
      // Update
      update_timer(counters.timer[i]);

      // Play countdown sound if data-audio=true on container div
      let audio = counters.timer[i].div.dataset.audio
      if (audio && counters.timer[i].value == 5) {
        counter_play_sound(audio);
      }
    }
  }

  // If no more running timers, then clear ticker
  var timerIsRunning = false;
  for (var t in counters.timer) {
    timerIsRunning = timerIsRunning || counters.timer[t].running
  }
  if (!timerIsRunning) {
    clearInterval(counters.ticker);
    counters.ticker = null;
  }
}

var counter_play_sound = function(url) {
  if (typeof url === 'boolean') {
    url = 'libs/countdown/smb_stage_clear.mp3';
  }
  sound = new Audio(url);
  sound.play();
}

var counter_addEventListener = function() {
  if (!document.getElementsByClassName("countdown").length) {
    setTimeout(counter_addEventListener, 2);
    return;
  }
  var counter_divs = document.getElementsByClassName("countdown");
  console.log(counter_divs);
  for (var i = 0; i < counter_divs.length; i++) {
    counter_divs[i].addEventListener("click", countdown, false);
  }
};

counter_addEventListener();
