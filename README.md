# Open MCT Coding Exercise


## Introduction

This exercise involves connecting to a telemetry data server, and displaying the telemetry produced by it in a table. This requires the ability to issue HTTP requests, manage WebSocket connections, and update a web page using JavaScript.

In this exercise we use the Open MCT tutorial server as the source of telemetry data. The Open MCT tutorial server provides a very simple simulation of a spacecraft generating data for various “telemetry points”. Telemetry points are the term we use to describe measurable “things” on the spacecraft. These might be sensors or instruments measuring things like temperature, voltage, current, etc. in different systems on the spacecraft.


## Functionalities

1. To query the given telemetry server for the last 15 minutes of historical telemetry data for
either or both of the “pwr.v” and “pwr.c” telemetry points. The telemetry points are selectable by the user. Changing the selected telemetry points results in only data from the selected telemetry points being shown in the table.
2. To display the returned telemetry data in an HTML table sorted ascending or descending by timestamp. The sort order is selectable by the user.
3. To subscribe for new telemetry from the selected telemetry points and to add rows to the table as new data becomes available, maintaining the selected sort order. When the user changes the selected telemetry point, it only maintains subscriptions to selected telemetry points, and any telemetry data for a deselected telemetry point is removed.


## Installation

```
git clone ​https://github.com/nasa/openmct-tutorial.git 
git clone ​https://github.com/vgomezgonzalez/openMCT-coding-exercise
cd openmct-tutorial
npm install
npm start
```


## Run

```
Open the url "http://localhost:8080/telemetryTable.html" in any browser.
Select/deselect "pwr.c" and/or "pwr.v" checkboxes to filter the telemetry.
Click on "Telemetry" header to switch the order between ascending/descending.
```


## Notes

Given the amount of telemetry data retrieved from the server, after a few minutes the high amount of data loaded significatively slows down the display of the table. For testing it is recommended to open the web page shortly after starting the server, so the amount of data is easier to display, sort and filter. Alternatively, it is also possible to edit the default parameter (15 minutes) in line 4 of "scripts.js":

```
i.e. replace:
  var start = end - 900000;
with:
  var start = end - 60000;
```
