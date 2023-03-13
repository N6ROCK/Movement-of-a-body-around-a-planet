const pi = 3.1415926536; //Value of pi
const c_keha = 0.47; // Aerodynamic parameter for landing module
const mu_atm = 29; //Mass of one kilomole of air
const r_gaas = 8314; //Universal gas constant
const G = Math.pow(10,-11) * 6.67408; //Gravity constant
const e = 2.71828182; // Value of e
var images = []; //Array to store images of planets
var planeta = []; //Array for displaying images of planets
var label = ""; //Title for displaying pictures of planets
var cssheight = 0; //Picture height
var csswidth = 0; //Picture width
var min = 0; //The minimum value that can be displayed on the chart
var max = 0; //The maximum value that can be displayed on the chart

function generateVenus(){
	//This function will create new variables. 
	//New and existing ones that were originally null or empty will be given venus related values
	const m_planet = Math.pow(10, 24) * 4.8675;
	const r_planet = 6052;
	const g_rask = 8.87;
	const p_atm = Math.pow(10, 6) * 9.3;
	const t_atm = 737;
	label = "Venus";
	cssheight = 200;
	csswidth = 200;
	min = -15000;
	max = 15000;
	images.push({ url: "https://www.transparentpng.com/thumb/venus/discover-solar-system--part-1--kila-blog-16.png"});
	generateGrafik(m_planet, r_planet, g_rask, p_atm, t_atm, images, label);
}

function generateEarth(){
	//This function will create new variables. 
	//New and existing ones that were originally null or empty will be given earth related values
	const m_planet = Math.pow(10, 24) * 5.9726; //Mass of he Earth in kilograms
	const r_planet = 6371; //Radius of the Earth in kilometers
	const g_rask = 9.807; //Acceleration of gravity
	const p_atm = Math.pow(10, 6); //Pressure of atmolanding module on the sea level in Pascale
	const t_atm = 287; //Temperature of atmosphere on the sea level in Kelvin
	label = "Earth";
	cssheight = 300;
	csswidth = 300;
	min = -9000;
	max = 9000;
	images.push({ url: "https://icon-library.com/images/earth-png-icon/earth-png-icon-9.jpg"});
	generateGrafik(m_planet, r_planet, g_rask, p_atm, t_atm, images, label);
}

function openMenu(){
	document.getElementById("sidebar").classList.toggle('active');
}	

function generateGrafik(m_planet, r_planet, g_rask, p_atm, t_atm, images, label){
	//This function calculates the coordinates that are intended for plotting
	const r_keha = parseFloat(document.querySelector('.radius').value); //Radius of body(The value is taken from the input field)
	const m_keha = parseFloat(document.querySelector('.mass').value); //Mass of body
	var xdata = parseFloat(document.querySelector('.xcoordinate').value); //Start x coordinate
	var ydata = parseFloat(document.querySelector('.ycoordinate').value); //Start y coordinate
	const s_keha = Math.pow(r_keha,2) * pi; //Body square
	const v_keha = (Math.pow(r_keha, 3) * pi * 4) / 3; //Body volume
	var vx = 0; //velocity (x-projection) of body at start time moment
	var vy = 8; //velocity (y-projection) of body at start time moment
	var dps = []; //Array to store x and y coordinates
	const dt = 0.1; //Time step in seconds
	const ro_atm_0 = (p_atm * mu_atm) / (r_gaas * t_atm); //Calculation of the density of air on a sea level	
	const param4 = (mu_atm * g_rask * 1000.) / (r_gaas * t_atm); //Variable for further density calculation
	for(let i = 0; i <= 1000000; i = i + 1){
		dps.push({
			x: xdata,
			y: ydata
		});
		h = Math.sqrt(xdata * xdata + ydata * ydata) - r_planet; //Height of trajectory
		if(h<0.){
		console.log(h,i);
		break;}
		ro_atm = ro_atm_0 * Math.pow(e, -(param4*h)); //Density of atmosphere on height h
		rr = Math.sqrt(xdata * xdata + ydata * ydata); //Calculation of the distance between satellite and center of the Earth
		param1 = -((G * m_planet * Math.pow(10, -9))/(Math.pow(rr, 3))); //The force of gravity
		param2 = (500 * c_keha * s_keha * ro_atm * Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2)))/m_keha; //Resistance force		
		ax = param1 * xdata - param2 * vx; //Acceleration along the x-coordinate
		ay = param1 * ydata - param2 * vy; //Acceleration along the y-coordinate		
		xdata = xdata + vx * dt + ((ax * Math.pow(dt, 2))/2); //x-coordinate		
		ydata = ydata + vy * dt + ((ay * Math.pow(dt, 2))/2); //y-coordinate
		vx = vx + ax * dt; 		
		vy = vy + ay * dt;
	}
	var chart = new CanvasJS.Chart("chartContainer", {
		//Creating a Graph
		theme: "dark1", 
		//Adding text to the graph
		title:{
			text: "The movement of a body around the planet"
		},
		//Minimum and maximum value in the x and y axes
		axisX: {
			minimum: min,
			maximum: max
		},
		axisY:{
			minimum: min,
			maximum: max
		},
		//Selecting the type of chart and what values it is based on
		data: [{        
			type: "line",
			indexLabelFontSize: 20,
			dataPoints: dps
	}]
});
chart.render();
planeta.push( $("<img>").attr("src", images[(images.length) - 1].url)
				.attr("class", label)
				.css("display", "none")
				.css("height", cssheight)
                .css("width", csswidth)
				.appendTo($("#chartContainer>.canvasjs-chart-container"))
               );
var pixelX = chart.axisX[0].convertValueToPixel(0);
var pixelY = chart.axisY[0].convertValueToPixel(0);

planeta[(planeta.length) - 1].css({"position": "absolute", 
           "display": "block",
           "top": pixelY - planeta[(planeta.length) - 1].height()/2,
           "left": pixelX - planeta[(planeta.length) - 1].width()/2,
           });
chart.render();
}