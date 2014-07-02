/**
 * Created by Prashant on 17-May-14.
 */

var width = window.innerWidth-10,
height =  window.innerHeight-50;
//var center = { x : width/2 , y : 0 };
var center = { x : width/2 , y : height/2 };

var _xs = 1;
var _ys = 1;

var n = 100,
m = 12,
degrees = 180 / Math.PI;
var counter = 0;
var isStarted = false;
var isFertiliseStart = false;
var eggScale = 0;

var spermatozoa = d3.range(n).map(function() {
    var x = (Math.random() * width ) + 0,
    y = (Math.random() * height);
    x = getRandomX();
    y = getRandomY(x);
    return {
    vx: getAngle(x,y,center.x,center.y)[0],
    vy: getAngle(x,y,center.x,center.y)[1],
    arc: ( Math.floor(Math.random() * 20) + 10) ,
    speed: (Math.random()*1)+1 ,
    path: d3.range(m).map(function() { return [x, y]; }),
    count: 0
    };
    });

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);

var eggshell = svg.append("defs")
.append('pattern')
.attr('id', 'eggshell')
.attr('patternUnits', 'userSpaceOnUse')
.attr('width', 300)
.attr('height', 300)
.attr('x', -150)
.attr('y', 150)
.append("image")
.attr("xlink:href", "img/2256773.png")
.attr('width',300)
.attr('height', 300);

var babyshell = svg.append("defs")
.append('pattern')
.attr('id', 'babyshell')
.attr('patternUnits', 'userSpaceOnUse')
.attr('width', 300)
.attr('height', 300)
.attr('x', -150)
.attr('y', 150)
.append("image")
.attr("xlink:href", "img/baby-inside-womb.png")
.attr('width',300)
.attr('height', 300);

var childshell = svg.append("defs")
.append('pattern')
.attr('id', 'childshell')
.attr('patternUnits', 'userSpaceOnUse')
.attr('width', 300)
.attr('height', 300)
.attr('x', -150)
.attr('y', 150)
.append("image")
.attr("xlink:href", "img/baby-inside-womb.png")
.attr('width',300)
.attr('height', 300);



var egg = svg.append("circle")
.attr("r", 100)
.style("fill","url(#eggshell)")
.attr("transform", function(){
    return "translate("+center.x+"," + center.y +")"
    });

var baby = svg.append("image")
//        .attr("r", 100)
//        .style("fill","url(#babyshell)")
.attr("xlink:href", "img/baby-inside-womb.png")
.attr('width',300)
.attr('height', 300)
.attr('x',-150)
.attr('y',-150)
.attr("transform", function(){
    return "translate("+center.x+"," + center.y +")"
    })
.style("opacity",0);

var child = svg.append("image")
//        .attr("r", 100)
//        .style("fill","url(#babyshell)")
.attr("xlink:href", "img/baby-inside-womb2.jpg")
.attr('width',300)
.attr('height', 300)
.attr('x',-150)
.attr('y',-150)
.attr("transform", function(){
    return "translate("+center.x+"," + center.y +")"
    })
.style("opacity",0);

var g = svg.selectAll("g")
.data(spermatozoa)
.enter().append("g");

var head = g.append("ellipse")
.attr("rx", 6.5)
.attr("ry", 4);

g.append("path")
.datum(function(d) { return d.path.slice(0, 3); })
.attr("class", "mid");

g.append("path")
.datum(function(d) { return d.path; })
.attr("class", "tail");

var tail = g.selectAll("path");

d3.timer(function() {
    for (var i = -1; ++i < n;) {
    var spermatozoon = spermatozoa[i],
    path = spermatozoon.path,
    dx = spermatozoon.vx * spermatozoon.speed,
    dy = spermatozoon.vy * spermatozoon.speed,
    speed = Math.sqrt(dx * dx + dy * dy),
    count = speed * 15,
    k1 = -5 - speed / 3;
    var x,y;

    if(isStarted){
    if(spermatozoon.isFirst){

    var _x =path[0][0];
    var _y =path[0][1];
    if(Math.sqrt((_x-center.x)*(_x-center.x) + (_y-center.y)*(_y-center.y)) < 10){
    isFertiliseStart = true;
    if(eggScale <= 3)
    eggScale = eggScale + 0.01;
//                      else {
//                          d3.select("svg")
//                                  .remove();
//                          document.getElementById("final").style.display = "block";
//                      }
//                      if(eggScale > 2)
//                          eggshell.attr("xlink:href", "img/baby-inside-womb.png");

    if(eggScale > 1) {
    zoom(eggScale);
    }

    if(eggScale > 0.5)
    {
    svg.select("g")
    .remove();
    }

    x = path[0][0];
    y = path[0][1];
    } else{
    x = path[0][0] += (dx/8)
    y = path[0][1] += (dy/8)
    }

    }else{

    if(spermatozoon.inside){

    if(spermatozoon.isCirular == undefined) {
    x = path[0][0];
    y = path[0][1];
    spermatozoon.isCirular = true;
    var _theta = Math.atan(spermatozoon.vy / spermatozoon.vx);
    var _ntheta = - _theta;
    spermatozoon.vy = Math.sin(_theta);
    spermatozoon.vx = Math.cos(_theta);
    spermatozoon.rTheta = _ntheta;
    if(x > center.x)
    spermatozoon.rs = -1;
    else
    spermatozoon.rs = 1;
    }
    else
    {
    var sx = spermatozoon.rs;
    //if(spermatozoon.rTheta < 0)
    //  sx = -1;
    spermatozoon.rTheta = spermatozoon.rTheta + (sx * Math.PI / 180);
    if(sx == 1 && spermatozoon.rTheta >= 2 * Math.PI)
    spermatozoon.rTheta = 0;
    else if(sx == -1 && spermatozoon.rTheta <= -2 * Math.PI)
    spermatozoon.rTheta = 0;
    var _ntheta = spermatozoon.rTheta;
    spermatozoon.vy = Math.cos(_ntheta);
    spermatozoon.vx = Math.sin(_ntheta);
    x = path[0][0] += spermatozoon.vx * 2;
    y = path[0][1] += spermatozoon.vy * 2;
    }
    }else{
    var _x =path[0][0];
    var _y =path[0][1];
    if(Math.sqrt((_x-center.x)*(_x-center.x) + (_y-center.y)*(_y-center.y)) < (100+spermatozoon.arc) ){
    x = path[0][0];
    y = path[0][1];
    if(spermatozoon.inside == undefined ){
    spermatozoon.inside = true;
    iTouchEgg();
    }
    } else if(!isFertiliseStart){
    x = path[0][0] += dx;
    y = path[0][1] += dy;
    }
    else
    {
    x = path[0][0];
    y = path[0][1];
    }
    }
    }


    }else{
    if(spermatozoon.inside){
    x = path[0][0];
    y = path[0][1];
    }else{
    var _x =path[0][0];
    var _y =path[0][1];
    if(Math.sqrt((_x-center.x)*(_x-center.x) + (_y-center.y)*(_y-center.y)) < 100){
    x = path[0][0];
    y = path[0][1];
    if(spermatozoon.inside == undefined ){
    spermatozoon.inside = true;
    if(counter == 0){
    spermatozoon.isFirst = true;
    }
    iTouchEgg();
    }
    }
    else if(!isFertiliseStart){
    x = path[0][0] += dx;
    y = path[0][1] += dy;
    }
    else
    {
    x = path[0][0];
    y = path[0][1];
    }
    }
    }



    // Bounce off the walls.
//   if (x < -100 || x > width) spermatozoon.vx *= -1;
//   if (x < -100 ) spermatozoon.vx *= -1;
//	if (x < 0 ) spermatozoon.vx *= -1;
    //if (y < 0 || y > height) spermatozoon.vy *= -1;
    //if (y < 0 ) spermatozoon.vy *= -1;

    // Swim!
    for (var j = 0; ++j < m;) {
    var vx = x - path[j][0],
    vy = y - path[j][1],
    k2 = Math.sin(((spermatozoon.count += count) + j * 10) / 500) / speed;

    path[j][0] = (x += dx / speed * k1) - dy * k2;
    path[j][1] = (y += dy / speed * k1) + dx * k2;
    speed = 1.6* Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
    }

    }

    head.attr("transform", headTransform);
    tail.attr("d", tailPath);
    });

function headTransform(d) {
    return "translate(" + d.path[0] + ")rotate(" + Math.atan2(d.vy, d.vx) * degrees + ")";
    }
function tailPath(d) {
    return "M" + d.join("L");
    }

function getAngle(dx,dy,cx,cy){
    var __ddx = dx+"";
    var __ddy = dy+"";
    var _vx = 0;
    var _vy = -1;
    var _c = cy;
    var dx = cx - dx;
    var dy = _c - dy;
    var k = Math.sqrt((dx*dx) + (dy*dy))
    _vx = -(dx / k);
    _vy = (dy / k);

    if(__ddy > 0 ){
    if(dy < _c){
    _vy *= 1
    }else{
    _vy *= -1
    }
    } else{
    if(dy < _c){
    _vy *= -1
    }else{
    _vy *= 1
    }
    }

    if(__ddx > 0 ){
    if(dx < cx){
    _vx *= -1
    }else{
    _vx *= 1
    }
    } else{
    if(dx < cx){
    _vx *= 1
    }else{
    _vx *= -1
    }
    }


    return [_vx,_vy];
    }

function iTouchEgg(){

    if(counter > 0 ){
    isStarted = true;
//        console.log(counter);
    }

    counter++;
    }

function getRandomX(){
    if((Math.floor(Math.random()*2) == 1 ? 1 : -1) < 0){
    var _xr = 0;
    _xr = Math.floor(Math.random() * (width+(100)) ) + (width);
    _xr *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    if(_xr < 0 ){
    _xr += ( width );
    }
    return _xr;
    }else{
    var _xr = 0;
    _xr = Math.floor(Math.random() * (width) ) + (0);
    _xr *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    if(_xr < 0 ){
    _xr += ( width );
    }
    return _xr;
    }

    }

function getRandomY(_ccx){
    if(_ccx < 0 || _ccx > width){
    var _yr = 0;
    _yr = Math.floor(Math.random() * (height))+ (0);
    _yr *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    if(_yr < 0 ){
    _yr += ( height );
    }
    return _yr;
    }else {
    var _yr = 0;
    _yr = Math.floor(Math.random() * (height+(100)) ) + (height);
    _yr *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    if(_yr < 0 ){
    _yr += ( height );
    }
    return _yr;

    }

    }

function zoom(eggScale)
{
    egg.attr("transform",
            "translate("+center.x+"," + center.y +")"
            + " scale(" + eggScale + ")");

    baby.attr("transform",
    "translate("+center.x+"," + center.y +")"
    + " scale(" + eggScale + ")");

    child.attr("transform",
    "translate("+center.x+"," + center.y +")"
    + " scale(" + eggScale + ")");

    if(eggScale < 2) {
    egg.style("opacity", (2 - eggScale));

    baby.style("opacity", (eggScale - 1));
    }
    else
    {
    baby.style("opacity", (3 - eggScale));

    child.style("opacity", (eggScale - 2));
    }

    }
