Line[] lines;
Line[] ticks;
int activeWidth = 20, activeSide1 = 17; activeSide2 = 11, inactiveWidth = 5;
Line lastActive = null;
int idxLSide1, idxLSide2, idxRSide1, idxRSide2;
boolean rdraw = false;
int count; int tickCount; int radius; int offsetx; int offsety;

String hoverColor = #2FB6C9;
String circleColor = #DDDEDD;
String backgroundColor = #DDDEDD;
String alertColor = #FA8952;
String normalColor = #1A3A3D;
String tickColor = #000000;

void doModal() {	
	$('input[name=modal]').click(function(e) {
		e.preventDefault();
		var id = $('#dialog');

		var maskHeight = $(document).height();
		var maskWidth = $(window).width();
	
		$('#mask').css({'width':maskWidth,'height':maskHeight});
		
		$('#mask').fadeTo("slow",0.8);	
	
		var winH = $(window).height();
		var winW = $(window).width();

		$(id).css('top',  winH/2-$(id).height()/2);
		$(id).css('left', winW/2-$(id).width()/2);
	
		$(id).fadeIn(1500); 
	});

	$('input[name=state]').click(function(e) {
		e.preventDefault();
		string newstate = $(this).attr('value')
		setState(newstate);
		$('#mask, .window').hide();
	});
	
	//if close button is clicked
	$('.window .close').click(function (e) {
		//Cancel the link behavior
		e.preventDefault();
		$('#mask, .window').hide();
	});		
	
	//if mask is clicked
	$('#mask').click(function () {
		$(this).hide();
		$('.window').hide();
	});			
	
}

int areaOfTriangle(int x1, int y1, int x2, int y2, int x3, int y3) {
	int a = ((x3*y2)-(x2*y3));
	int b = ((x3*y1)-(x1*y3));
	int c = ((x2*y1)-(x1*y2));
	return a - b + c;
}

int negPosZero(int a) {
	if (a == 0) {
		return 0;
	} else {
		return a > 0 ? 1 : -1;
	}
}

/**
 * Class for each process instance
 */
class Line {
	int x1, y1, x2, y2;
	int x3, y3, x4, y4;
	int length;
	int index;
	int angle;
	int origAngle, origLength; // for tsunami code
	int boxwidth; // half of the width of the box
	int origWidth;
	String color;
	String origColor;

	int instanceTicket;
	int instanceTime;
	string currentTask;
	int taskTicket;
	int taskTime;
	int sla;
	string comment;
	string modifiedBy;
	string url;
	string state; // could be used to represent the status

	Line (int l, int w, int t, int idx, string hyperlink, string currTask, string currState) {
		index = idx;
		length = l; origLength = length;
		angle = t + ((PI+.05)/2); origAngle = angle;
		boxwidth = w; origWidth = boxwidth;

		setNewState(currState);

		currentTask = currTask;
		url = hyperlink;

		// Some data for looks
		instanceTicket = floor(random(999999)) + 400000;
		instanceTime = floor(l / 4);
		taskTicket = floor(random(999999)) + 400000;
		taskTime = floor(random(22)) + 1;
		sla = floor(random(3)) + 20;
		comment = "I found out that the power cord was gone!";
		modifiedBy = "Joe McBob";

		calculate();
	}

	void draw() {
		if (length < 0) {
			if(lastActive != this) { color = origColor; }
			strokeWeight(1);
			stroke(250, 1);
			document.getElementById("taskInfo").innerHTML = '<tr>Task:</tr><tr>' + currentTask + '</tr>' +
				'Click <a href\="filter.html">here</a> for the filter view';
		} else if(lastActive == this) {
			if(state == "Halted") { strokeWeight(2); stroke(origColor); }
			else { strokeWeight(1); stroke(250,1); }
			document.getElementById("taskInfo").innerHTML = '<tr><td width\="120px">Instance:</td><td>Ticket <a href\="instance.html">' + instanceTicket +
				"</a></td></tr><tr><td width\='120px'></td><td>Time Elapsed: " + instanceTime +
				" days</td></tr><tr><td width\='120px'>Current Task:</td><td>" + currentTask +
				"</td></tr><tr><td width\='120px'></td><td>Ticket: <a href\='instance.html'>" + taskTicket +
				"</a></td></tr><tr><td width\='120px'></td><td>Time Elapsed: " + taskTime +
				" hr </td></tr><tr><td width\='120px'>SLA:</td><td>" + sla +
				" days</td></tr><tr><td width\='120px'>Last Comment:</td><td>" + comment +
				"</td></tr><tr><td width\='120px'>Last Modified:</td><td>" + modifiedBy +
				"</td></tr><tr><td width\='120px'>Status:" +
				'</td><td>' + state + '<br /><form><input name\="modal" type\="submit" value\="Change State" /></form></td></tr>'
			doModal();
		} else {
			color = origColor;
			strokeWeight(1);
			stroke(250, 1);
		}
		fill(color);
		quad(x1, y1, x2, y2, x3, y3, x4, y4);
	}

	void debug() {
	}

	void calculate() {
		// Calculate everything
		int mx1 = offsetx  + (radius *  cos(angle));
		int my1 = offsety  + (radius * -sin(angle));
		int mx2 = mx1 + (length *  cos(angle));
		int my2 = my1 + (length * -sin(angle));

		// Slope our center line
		int s = ((my2 - my1) / (mx2 - mx1));


		// slope of perpendicular line
		int ps = (s == 0 ? -9999999 : ((-1) / s));

		// differences
		int dx = sqrt(sq(boxwidth) / (1 + sq(ps))) / 2
			int dy = ps * dx

			// Actual box boundries
			x1 = mx1 + dx; 	y1 = my1 + dy;
		x4 = mx1 - dx; 	y4 = my1 - dy;

		x2 = mx2 + dx; 	y2 = my2 + dy;
		x3 = mx2 - dx; 	y3 = my2 - dy;
	}


	boolean isPointInside(int x, int y) {
		int area1 = negPosZero(areaOfTriangle(x, y, x1, y1, x2, y2));
		int area2 = negPosZero(areaOfTriangle(x, y, x2, y2, x3, y3));
		int area3 = negPosZero(areaOfTriangle(x, y, x3, y3, x4, y4));
		int area4 = negPosZero(areaOfTriangle(x, y, x4, y4, x1, y1));

		return ((area1 == area2) && (area1 == area3) && (area1 == area4));
	}

	void setNewState(string currState) {
		if(currState == "In Process") {
			color = normalColor;
		} else if (currState == "Halted") {
			color = alertColor;
		} else if (currState == "Canceled") {
			color = #888888;
		} else if (currState == "tick") {
			color = tickColor;
		} else {
			color = #991111;
		}
		state = currState;
		origColor = color;
	}

	// used for tsnuami code
	void setAngle(int rads) {
		if (angle == origAngle ) { origAngle = angle; }
		angle = rads;
		if (length == origLength) { origLength == length; }
		length = origLength + 20;
		calculate();
	}

	void resetline() {
		boxwidth = origWidth;
		angle = origAngle;
		length = origLength;
		calculate();
	}

	void updateTick() {
		boolean isPointIn = isPointInside(mouseX, mouseY);
		if(isPointIn && boxwidth != activeWidth) {
			lastActive = this;
			boxwidth = activeWidth;
			color = hoverColor;
			calculate();
			rdraw = true;
		} else if (!isPointIn && boxwidth == activeWidth) {
			boxwidth = origWidth;
			calculate();
			rdraw = true;
		}
	}

	void update() {
		boolean isPointIn = isPointInside(mouseX, mouseY);

		if (isPointIn && boxwidth != activeWidth) {
			// We are inside. Change colors fire events, etc.
			if(lastActive && lastActive.length > -1) {
				color = origColor;
				lastActive.resetline();
				lines[idxLSide2].resetline();
				lines[idxLSide1].resetline();
				lines[idxRSide2].resetline();
				lines[idxRSide1].resetline();
			}
			boxwidth = activeWidth;
			color = hoverColor;
			length = origLength + 20;
			lastActive = this;
			calculate();

			idxLSide2 = index - 2 >= 0 ? index-2 : count+(index-2);
			lines[idxLSide2].boxwidth = activeSide2;
			lines[idxLSide2].setAngle(angle - radians(7));
			lines[idxLSide2].calculate();

			idxLSide1 = index - 1 >= 0 ? index-1 : count+(index-1);
			lines[idxLSide1].boxwidth = activeSide1;
			lines[idxLSide1].setAngle(angle - radians(4));
			lines[idxLSide1].calculate();

			idxRSide2 = index + 2 < count ? index + 2 : index+2-count;
			lines[idxRSide2].boxwidth = activeSide2;
			lines[idxRSide2].setAngle(angle + radians(7));
			lines[idxRSide2].calculate();

			idxRSide1 = index + 1 < count ? index + 1 : index+1-count;
			lines[idxRSide1].boxwidth = activeSide1;
			lines[idxRSide1].setAngle(angle + radians(4));
			lines[idxRSide1].calculate();

			rdraw = true;
		} else if (!isPointIn && boxwidth == activeWidth) {
			resetline();
			lines[idxLSide2].resetline();
			lines[idxLSide1].resetline();
			lines[idxRSide2].resetline();
			lines[idxRSide1].resetline();
			rdraw = true;
		}
	}
}

// Called once on load
void setup() {
	frameRate(25);
	size(650, 650);
	smooth();
	count = 144;
	tickCount = 10;
	lines = new Line[count];
	ticks = new Line[tickCount];

	offsetx = 325; // half of size to center
	offsety = 325;
	radius = 200;

	for (int i = 0; i < tickCount; i++) {
		ticks[i] = new Line(-15, 10, radians(36*i-1),
							i, "filter.html", "Task Name goes here", "tick");
		ticks[i].draw();
	}

	for (int i = 0; i < count; i++) {
		lines[i] = new Line((count - i)/2+random(29)+2, 5, radians(2.5*i + .1),
							i, "instance.html", "Installing the new fluxcapacitor!",
							random(29) > 25 ? "Halted" : "In Process");
		lines[i].draw();
	}

	document.getElementById("taskInfo").innerHTML = "<center><br><br><br><br><br><br>Select a process instance to see more details. </center>";
}

void mousePressed() {
	if(lastActive != null && lastActive.boxwidth == activeWidth) {
		window.location = lastActive.url;
	}
}


void setState(string newstate) {
	lastActive.setNewState(newstate);
	lastActive.color = hoverColor;
	rdraw = true;
}

// Called the number of frames per second
void draw() {
	if(rdraw) {
		background(backgroundColor);
		fill(circleColor);
		noStroke();

		ellipse(offsetx, offsety, radius*2, radius*2);

		for(int i = 0; i < tickCount; i++) {
			ticks[i].draw();
		}

		// a line is selected do tsunami
		if(lastActive.boxwidth == activeWidth) {
			for(int i = 0; i < count; i++) {
				if(i != idxLSide2 && i != idxLSide1 && i != idxRSide2 && i != idxRSide1)
				{
					lines[i].draw();
				}
			}

			lines[idxLSide2].draw();
			lines[idxLSide1].draw();
			lines[idxRSide2].draw();
			lines[idxRSide1].draw();
		}
		// Draw lines normally nothing is selected
		else {
			for (int i = 0; i < count; i++) {
				lines[i].draw();
			}
		}

		// Draw the last active bar last so it sits on top of the rest
		lastActive.draw();
		rdraw = false;
	} else {
		int i;
		for (i = 0; i < count; i++) {
			lines[i].update();
		}
		for (i = 0; i < tickCount; i++) {
			ticks[i].updateTick();
		}
	}
}
