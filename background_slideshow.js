{
	// change this one for slower background change
	const updateInterval= 10 *60 // in seconds


	const path= "/local/HASlideshow/backgrounds/"

	function info(obj) {
		console.log('%c Background Slideshow %c '+( typeof obj =="string" ? obj: JSON.stringify(obj)), 
			'background: black;font-weight: bold;padding: 2px; border-radius:2px', 
			'background: transparent;font-weight: normal;padding: 0px; border-radius:0px')
	}

	function debug(obj) {
		console.debug('%c Background Slideshow %c '+( typeof obj =="string" ? obj: JSON.stringify(obj)), 
			'background: black;font-weight: bold;padding: 2px; border-radius:2px', 
			'background: transparent;font-weight: normal;padding: 0px; border-radius:0px')
	}

	let imagesCount, seed

	// AKA Sieve of Eratosthenes
	const getPrimes = (min, max) => {
	  const result = Array(max + 1)
	    .fill(0)
	    .map((_, i) => i);
	  for (let i = 2; i <= Math.sqrt(max + 1); i++) {
	    for (let j = i ** 2; j < max + 1; j += i) delete result[j];
	  }
	  return Object.values(result.slice(Math.max(min, 2)));
	};

	const getRandNum = (min, max) => {
	  return Math.floor(Math.random() * (max - min + 1) + min);
	};

	const getRandPrime = (min, max) => {
	  const primes = getPrimes(min, max);
	  return primes[getRandNum(0, primes.length - 1)];
	};

	// let's show all the images in random order
	seed= getRandPrime(1, 100000);

 
	// find max existing file number
	function checkNumber(n, callback) {
	    var http = new XMLHttpRequest();
	    http.open('HEAD', path + n + ".jpg");
	    http.onreadystatechange = function() {
	        if (this.readyState == this.DONE) {
	            callback(this.status != 404);
	        }
	    }
	    http.send();
	}

	let upward= true;

	function recur(n, interval) {
		checkNumber(n, function (exists) {

   			debug ("interval: "+interval+"   n: "+ n+ (exists? " exists": " not found"))

   			upward= upward && exists
   			if (upward)
   				interval*= 2   			
   			else 
   				interval/= 2

   			if (exists) {
   				if (interval>=1)
   					recur(n+interval, interval)
   				else {
   					
   					imagesCount= n+1
					info(imagesCount+ " pics available")
					current= Math.floor(Math.random() *imagesCount)
   				}
   			}
   			else {
   				if (interval >= 1)
   					recur(n-interval, interval)
   				else {
   					imagesCount= n
					info(imagesCount+ " pics available")
					current= Math.floor(Math.random() *imagesCount)
   				}
   			}
		})
	}

	// entry point
	if (window.location.search.indexOf("force_picsum") > 0 ) {
		bs_schedule(5000) // first update
		info("Using picsum images.")
	}
	else
		checkNumber(0, function (exists) {
			if (exists)
				recur(2,1)
			else
				info("No local images found in www/HASlideshow/backgrounds, showing random picsum images")

			bs_schedule(5000) // first update
		})
 
	function bs_setBackgroundImage(url) {
		bs_getBackgroundElement().setAttribute("style",'--lovelace-background:center / cover no-repeat fixed url("'+ url + '");')
	}

	// this might break on a Lovelace update. 
	function bs_getBackgroundElement() {
		return document.querySelector("body > home-assistant").shadowRoot.querySelector("home-assistant-main").shadowRoot
					.querySelector("app-drawer-layout > partial-panel-resolver > ha-panel-lovelace").shadowRoot.querySelector("hui-root")
					.shadowRoot.querySelector("#layout")
	}

	let current

	function bs_update() {
		if (bs_getBackgroundElement().getAttribute("style") != null) {
			debug("Detected view with background, updating image")

			let url
			if (imagesCount) {
				current= (current+seed) % imagesCount
				url= path +current+".jpg"
			}
			else {
				url= "https://picsum.photos/1920/1080/?blur=1&tstamp="+Date.now()
			}
			 
			bs_setBackgroundImage(url)
			info("Updated background to "+url)
		}
	}

	var bs_lastTap= 0
	function bs_handle_tap(e) {
		const now= Date.now()
		if (now - bs_lastTap < 500) { // detect double tap
			debug("Double tap event")
			bs_update()
		}
		bs_lastTap= now
	}

	var bs_tap_handler= null

	function bs_register_tap() {
		if (bs_tap_handler==null) {

			bs_tap_handler=1
			document.body.addEventListener('pointerdown', bs_handle_tap)

			debug("Registered tap handler")
		}
	}

	function bs_schedule(interval) {
		
		setTimeout(() => {
				bs_register_tap() // now because of slow hw
				debug("Update event")
				bs_update()	  

		  bs_schedule(updateInterval*1000)
		}, interval)
		debug("Scheduling next update in "+ interval/1000 + " seconds")
	}
}