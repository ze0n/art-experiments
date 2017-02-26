function pathToPolygon(path,samples){
    if (!samples) samples = 0;
    var doc = path.ownerDocument;
    var poly = doc.createElementNS('http://www.w3.org/2000/svg','polygon');

    // Put all path segments in a queue
    for (var segs=[],s=path.pathSegList,i=s.numberOfItems-1;i>=0;--i) segs[i] = s.getItem(i);
    var segments = segs.concat();

    var seg,lastSeg,points=[],x,y;
    var addSegmentPoint = function(s){
        if (s.pathSegType == SVGPathSeg.PATHSEG_CLOSEPATH){
            
        }else{
            if (s.pathSegType%2==1 && s.pathSegType>1){
                // All odd-numbered path types are relative, except PATHSEG_CLOSEPATH (1)
                x+=s.x; y+=s.y;
            }else{
                x=s.x; y=s.y;
            }
            var lastPoint = points[points.length-1];
            if (!lastPoint || x!=lastPoint[0] || y!=lastPoint[1]) points.push([x,y]);
        }
    };
    for (var d=0,len=path.getTotalLength(),step=len/samples;d<=len;d+=step){
        var seg = segments[path.getPathSegAtLength(d)];
        var pt  = path.getPointAtLength(d);
        if (seg != lastSeg){
            lastSeg = seg;
            while (segs.length && segs[0]!=seg) addSegmentPoint( segs.shift() );
        }
        var lastPoint = points[points.length-1];
        if (!lastPoint || pt.x!=lastPoint[0] || pt.y!=lastPoint[1]) points.push([pt.x,pt.y]);
    }

    var newPoints = [];

    for (var i=0;i<points.length;i++){
        if(!(isNaN(points[i][0]) || isNaN(points[i][1])))
            newPoints.push(points[i]);
    }

    for (var i=0,len=segs.length;i<len;++i) addSegmentPoint(segs[i]);
    for (var i=0,len=newPoints.length;i<len;++i) newPoints[i] = newPoints[i].join(',');
    poly.setAttribute('points', newPoints.join(' '));
    return poly;
}

var heroes = {
    "danil": {
            "curve": document.getElementById('ldanil'),
            "polygon": pathToPolygon(document.getElementById('ldanil'), 200),
            "color": "rgba(247, 44, 37, 0.6)",
            "parts": []
        },
    "nadya": {
            "curve": document.getElementById('lnadya'),
            "polygon": pathToPolygon(document.getElementById('lnadya'), 200),
            "color": "rgba(241, 143, 1, 0.6)",
            "parts": []
        },
    "tanya": {
            "curve": document.getElementById('ltanya'),
            "polygon": pathToPolygon(document.getElementById('ltanya'), 200),
            "color": "rgba(37, 92, 153, 0.6)",
            "parts": []
        },
};

var totalHeroes = jQuery.extend(true, {}, heroes);
for(var h in totalHeroes){
    totalHeroes[h].parts = [[0, 300]];
    totalHeroes[h].color = "rgba(200, 200, 200, 0.2)";
}


console.log(heroes);

var selected = "tanya";
var timer;
var T = 0;
var maxT = 300;
var curPart = [0, 0];
heroes[selected].parts.push(curPart);

function tick(t){
    T = t;
    curPart[1] = T;
    render();
    document.getElementById('tick').innerHTML = T;
    T++;

    if(T > maxT){
        stop();
    }
}

function setSelected(h){
    var newPart = [T, T];
    heroes[h].parts.push(newPart);
    curPart = newPart;
    selected = h;
}

function stop(){
    //clearTimeout(timer);
    console.log("Finished");
}


function renderHeroes(H, ctx, renderPipka = false){

  for(var h in H){
  
      if(renderPipka){
        ctx.lineWidth = 8;
       } else {
        ctx.lineWidth = 4;
       }

      var polygon = H[h].polygon;
      var Y;

      for(var pi=0;pi<H[h].parts.length;pi++){
        var part = H[h].parts[pi];

        var cur = 0;
        while(polygon.points[cur].x - 93 < part[0])
            cur++;

        ctx.strokeStyle = H[h].color;
        ctx.fillStyle = H[h].color;

        ctx.beginPath();

        ctx.moveTo((polygon.points[cur].x - 93) * 1.5 + 20, 300-(polygon.points[cur].y) * 1.5);

        //console.log(polygon.points[cur].x - 93, polygon.points[cur].y);
        
        while(polygon.points[cur].x - 93 < part[1]){
            ctx.lineTo((polygon.points[cur].x - 93) * 1.5 + 20, 300-(polygon.points[cur].y) * 1.5);
            //console.log(polygon.points[cur].x - 93, polygon.points[cur].y);
            cur++;
        }

        //ctx.closePath();
        ctx.stroke();

        Y = (polygon.points[cur].y);
      }

      if(renderPipka){
      if(h == selected){
          ctx.strokeStyle = heroes[h].color;
          ctx.fillStyle = heroes[h].color;
          ctx.beginPath();
          ctx.arc((curPart[1]) * 1.5 + 20, 300 - Y * 1.5, 5, 0, 2 * Math.PI, true);
          ctx.stroke();
          ctx.fill();
      }}



      // for(var i=0;i<polygon.points.length;i++){      
      //     var pp = polygon.points.getItem(i)
      //     ctx.strokeStyle = heroes[h].color;
      //     ctx.fill = heroes[h].color;
      //     ctx.beginPath();
      //     ctx.arc((pp.x - 93) * 1.5, pp.y * 1.5, 1.7, 0, 2 * Math.PI, true);
      //     ctx.stroke();
      // }
    }
}

function render(){

  // render skeletor
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  
  canvas.width  = 600;
  canvas.height = 400;

  renderHeroes(totalHeroes, ctx);
  renderHeroes(heroes, ctx, true);



}

//window.onload = function() {
    //timer = setInterval(tick, 100);

// ctx.beginPath();
// ctx.moveTo(poly[0], poly[1]);
// for( item=2 ; item < poly.length-1 ; item+=2 ){ctx.lineTo( poly[item] , poly[item+1] )}

// ctx.closePath();


//};