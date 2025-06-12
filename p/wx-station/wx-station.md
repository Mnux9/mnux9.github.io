# Weather station
<img src="images/IMG_2455.jpg"
     alt="Markdown Monster icon"
     style="float: left; margin-right: 10px; width:100%; padding-bottom: 2%;" /><br>

### Overview
A basic weather station built I with ESPHome for Home Assistant.

### Basic construction
I choose a small weather proof box and made a mounting bracked for my new IoT Friend board. The IoT Friend board was designed for all of my different ESPHome IoT projects, it allowed me to quickly build a basic Weather Station platform in a few hours. It has features for battery powered devices like being able to turn on/off power to the sensors.<br>
For start I added a 3000mAh battery, when transmitting every 45 seconds it will last around 5 days. Which is just enough time for my solar panel to arrive.

<img src="images/taken-apart.jpg"
     alt="Markdown Monster icon"
     style="float: left; margin-bottom:10px; margin-right: 10px; width:100%; padding-bottom: 4%;" />

### Temperature, humidity and pressure
Im starting with just a few small sensors I had on my desk. I found an AHT-20 for temp. and humidity and BMP-280 for pressure and temp.

<img src="images/IMG_2378.jpg"
     alt="Markdown Monster icon"
     style="float: left; margin-left: 3%; margin-right: 3%; width:45%" />

<img src="images/IMG_2740.png"
     alt="Markdown Monster icon"
     style="float: left; width:45%; padding-bottom:4%" /><br>



### Solar charger + power monitoring
For powering this station with a solar panel I got a cheap CN3065 solar charger module which I placed inside of the weather staion on a second
"panel" which I can fold out. There is also a purple INA3221 power (voltage & current) monitoring module which monitors: solar, battery and electronics power.

<img src="images/power-folded-out.jpg"
     alt="Markdown Monster icon"
     style="float: left; margin-bottom:10px; margin-right: 10px; width:100% ; padding-bottom: 4%" />

### Solar panel
With the solar charger I got this 1W solar panel for which I printed a mount. So far (during the summer) it seems to be producing enough power to sustain the station indefinitely, however this might change as I start to add more sensors and days start getting shorter.

<img src="images/panel.jpg"
     alt="Markdown Monster icon"
     style="float: left; margin-bottom:10px; margin-right: 10px; width:100%" />
