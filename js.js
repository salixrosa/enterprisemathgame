function game() {
	settings = {
		ranges: {
			addition: 100,
			subtraction: 100,
			timesx: [2,3,4,5,6,7,8,9],
			timesy: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
			division: 100,
		},
		operatorsettings: {
			"+": true,
			"-": true,
			"x": true,
			"/": true
		},
		alloperators: ["+","-","x","/"],
		chosenoperators: [],
		choseoperators: function() {
			settings.chosenoperators = settings.alloperators.filter(
				function(element) {
					if (settings.operatorsettings[element]){
						return(element)
					}
				}
			)
		},
		display: function(type) {
			var displaybox = cleanid("displaybox");
			var hidebutton = cleanid("hide");
			var showbutton = cleanid("show");

			if (type === "open") {
				displaybox.className = "extendeddisplay";
				hidebutton.className = "display";
				showbutton.className = "hide";
				pause();
				settings.initalize();
			}
			else if (type === "close") {
				displaybox.className = "minimizeddisplay";
				hidebutton.className = "hide";
				showbutton.className = "display";
				pause();
				settings.change();
			}
		},
		initialize: function() {
			cleanclass('addition button',0).checked = settings.operatorsettings["+"];
		},
		change: function() {

		}

	};

	function cleanid(id) {
		return(document.getElementById(id));
	};

	function cleanclass(name,index) {
		return(document.getElementsByClassName(name)[index]);
	};


	var questionslimit = 0;
	var timelimit = 0;

	var running;
	function setup() {
		document.getElementsByClassName('subtraction button')[0].checked = settings.operatorsettings["-"];
		document.getElementsByClassName('multiplication button')[0].checked = settings.operatorsettings["x"];		
		document.getElementsByClassName('division button')[0].checked = settings.operatorsettings["/"];
		generate();
		running = setInterval(timer,1000);
		settings.initialize();
	}

	function changesettings() {
		var displaybox = cleanid("displaybox");
		var hidebutton = document.getElementById("hide");
		var showbutton = document.getElementById("show");

		displaybox.className = "extendeddisplay";

		hidebutton.className = "display";
		showbutton.className = "hide";

		pause();
	}

	function closesettings() {
 		var displaybox = document.getElementById("displaybox");
 		var hidebutton = document.getElementById("hide");
 		var showbutton = document.getElementById("show");

 		alert("Frackers");

 		displaybox.className = "minimizeddisplay";

 		hidebutton.className = "hide";
 		showbutton.className = "display";

 		settings.operatorsettings["+"] = document.getElementsByClassName('addition button')[0].checked;
		settings.operatorsettings["-"] = document.getElementsByClassName('subtraction button')[0].checked;
		settings.operatorsettings["x"] = document.getElementsByClassName('multiplication button')[0].checked;	
		settings.operatorsettings["/"] = document.getElementsByClassName('division button')[0].checked;

		if (document.getElementById("timer").value !== "") {
			var maybelimit = document.getElementById("timer").value;
			if(!isNaN(maybelimit)) {
				timelimit = maybelimit;
			}
			else {
				alert("You entered an invalid number for your time limit.");
			}
		}

		if (document.getElementById("questions").value !== ""){
			var maybelimit = document.getElementById("questions").value;
			if(!isNaN(maybelimit)){
				questionslimit = maybelimit;
			}
			else{
				alert("You entered an invalid number for your question limit.");
			}
		}

 		pause();
 	}

	var problem = "";
	var answer = 0;
	function generate() {
		function randomoutof(i) {
			return Math.floor(Math.random()*i)+1;
		}
		function randomwithin(a) {
			return a[(Math.floor((Math.random()*a.length)))];
		}

		settings.choseoperators();
		var operator = randomwithin(settings.chosenoperators);

		switch (operator) {
			case "+":
				/* This logic creates a random number between 0 and the input number. The difference between the first random number and the input value is then calculated.
				The second random number is generated between zero and the calculated difference.
				This means the addition problem will never be greater than the input value. */
				var zo = settings.ranges.addition;
				var x = randomoutof(zo)-2;
				var zi = zo - x;
				var y = randomoutof(zi)+2;
				break;
		
			case "-":
				/* This logic creates a random number between 0 and the input number, then calculates a random number between zero and the first random number.
				This means the subtraction problem will never equal less than zero. */
				var zo = settings.ranges.subtraction;
				var x = randomoutof(zo);
				var y = randomoutof(x);
				break;

			case "x":
				/* This logic picks two random numbers out of the input arrays.
				This allows the user to pick the multiplication tables allowed in the problems. */
				var x = randomwithin(settings.ranges.timesx);
				var y = randomwithin(settings.ranges.timesy);

				operator = "*";

				break;

			case "/":
				/* This logic picks a random number between one and the input value.
				It then calculates all factors of that random number and randomly picks one of those factors. */
				var zo = settings.ranges.division - 1;
				var divisors = [];
				
				while(divisors.length < 1) {
					var divisor = [];
					var x = randomoutof(zo) + 1;
					var r = 0;
					for (var i = 2; i <= (x/3); i++) {
						r = x%i;
						if(r == 0) {
							divisors.push(i);
						}
					}
				}
				var y = randomwithin(divisors);
				break;
		}

		problem = x + " " + operator + " " + y;

		answer = eval(problem);

		document.getElementById("problem").innerHTML = problem;
		/*document.getElementById("seconds").innerHTML = seconds;*/
	};

	function clear() {
		document.getElementById("response").value="";
	}

	function eventdirect(event){
		var key = event.keyCode;

		if(key === 13) {
			check();
		}
		else if(key === 40) {
			pause();
		}
	}

	function check() {
		var response = document.getElementById("response").value;
		if(paused%2 != 0){
			if(!isNaN(response)) {
				if(Number(response) === answer) {
					generate();
					scoring(true);
				}
				else {
					flash();
					scoring(false);
				}
			}
		}
	}

	var totalseconds = 0;
	var seconds = 0;
	function timer() {
		totalseconds ++;
		seconds ++;
		var readabletime = totalseconds + "s";
		if (totalseconds > 60) {
			var minutes = Math.floor(totalseconds/60);
			readabletime = minutes + "m " + totalseconds%60 + "s";
		}
		document.getElementById("totaltime").innerHTML = readabletime;
		document.getElementById("seconds").innerHTML = seconds;
		document.getElementById("score").innerHTML = score;

	}

	var	score = 0;

	function scoring(check) {
		if (check) {
			score = (score + parseInt(10/(1+seconds)));
			seconds = 0;
			clear();
		}
		else if (!check) {
			score = (score - (1 * seconds));
		}
	}

	function flash() {
		var background = document.getElementById('runninggame');
		var internaltime = 0;
		var originalbgcolor = background.style.backgroundColor;
		background.style.backgroundColor = "#430000";
		function internalcount(){
			internaltime++;
			if (internaltime > 1) {
				clearInterval(begininternalcount);
				background.style.backgroundColor = originalbgcolor;
			}
		}
		var begininternalcount = setInterval(internalcount,100);
		clear();
	}

	var paused = 1;
	function pause() {
		if(paused%2==0) {
			generate();
			running = setInterval(timer,1000); /* Because stupid. */
			document.getElementById('response').style.display = "inline-block";
			document.getElementById('statustext').innterHTML="PAUSE";
			document.getElementById('response').focus();
		}
		else {
			document.getElementById('seconds').innerHTML = " ";
			seconds = 0;
			document.getElementById('problem').innerHTML="PAUSED";
			document.getElementById('statustext').innterHTML="PLAY";
			document.getElementById('response').style.display = "none";
			clearInterval(running);
		}
		paused++;
		console.log(paused)
	}

	setup();
	document.body.onkeydown = eventdirect;
	document.getElementById("show").onmousedown = changesettings;
	document.getElementById("hide").onmousedown = closesettings;

}

game();