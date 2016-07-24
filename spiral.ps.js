/**
 * @file Holds all RoboPaint spiral mode Paper.JS code
 */

canvas.paperInit(paper);

// Make this on the actionLayer
paper.canvas.actionLayer.activate();

paper.motionPath = new Path({
  data: {height: []} // A 1:1 match array for the motion path to set the height.
});

// Reset Everything on non-mainLayer and vars
paper.resetAll = function() {
  if (spiral) spiral.remove();

  paper.motionPath.removeSegments(0);
}

// Please note: dragging and dropping images only works for
// certain browsers when serving this script online:
var spiral, position, max;
var count = 0;
var grow = false;
var raster = null;

function onFrame(event) {
  canvas.onFrame(event);

  if (grow) {
    if (raster && (view.center - position).length < max) {
      for (var i = 0, l = count / 36 + 1; i < l; i++) {
        growSpiral();
      }
      spiral.smooth();
    } else {
      grow = false;
      if (paper.spiralComplete) paper.spiralComplete();

      // Enable the start/pause button after the spiral has been made.
      $('#pause').prop('disabled', false);
    }
  }
}

function growSpiral() {
  count++;
  var vector = new Point({
    angle: count * 5,
    length: count / 100
  });
  var rot = vector.rotate(90);
  var color = raster.getAverageColor(position + vector / 2);
  var value = color ? (1 - color.gray) * 3.7 : 0;

  paper.motionPath.add(position + vector / 2);
  var h = robopaint.utils.map((color ? color.gray : 0), 0, 1, 1, 0.4);
  paper.motionPath.data.height.push(h);

  rot.length = Math.max(value, 0.2);
  spiral.add(position + vector - rot);
  spiral.insert(0, position + vector + rot);
  position += vector;
}


paper.resetSpiral = function(callback) {
  paper.motionPath.removeSegments(0); // Remove all motionPath segments
  grow = true;

  paper.spiralComplete = callback;

  // Transform the raster, so it fills the view:
  raster.fitBounds(view.bounds);

  paper.canvas.tempLayer.activate(); // Draw the spiral on the tempLayer
  if (spiral) {
    spiral.remove();
  }

  position = view.center;
  count = 0;
  spiral = new Path({
    fillColor: 'black',
    closed: true
  });

  position = view.center;
  max = Math.min(raster.bounds.width, raster.bounds.height) * 0.5;
}

// Automatically paint the single spiral path.
paper.autoPaintSpiral = function(){
  mode.run([
    'wash',
    ['media', 'color0'],
    ['status', mode.t('status.printing')],
    'up'
  ]);

  var path = paper.motionPath;

  // Initial move without height set to get out onto the canvas.
  mode.run('move', {x: path.firstSegment.point.x, y: path.firstSegment.point.y});
  _.each(path.segments, function(seg, segIndex){
    mode.run([
      ['height', path.data.height[segIndex]],
      ['move', {x: seg.point.x, y: seg.point.y}]
    ]);
  });

  mode.run([
    'wash',
    'park',
    ['status', i18n.t('libs.autocomplete')],
    ['callbackname', 'spiralComplete']
  ]);

  // This tells pause Till Empty that we're ready to start checking for
  // local buffer depletion. We can't check sooner as we haven't finished
  // sending all the data yet!
  robopaint.pauseTillEmpty(false);
}

function onKeyDown(event) {
  if (event.key == 'space') {
    spiral.selected = !spiral.selected;
  }
}

paper.pickSpiralImage = function() {
  mainWindow.dialog({
    t: 'OpenDialog',
    title: mode.t('filepick.title'),
    filters: [
      { name: mode.t('filepick.files'), extensions: ['jpg', 'jpeg', 'gif', 'png'] }
    ]
  }, function(filePath){
    if (!filePath) {  // Open cancelled
      return;
    }

    paper.loadSpiralImage(filePath[0]);
  });
};

paper.loadSpiralImage = function (path) {
  paper.canvas.mainLayer.activate(); // Draw the raster to the main layer
  if (raster) raster.remove();
  try {
    raster = new Raster({
      source: dataURI(path),
      position: view.center
    });

    raster.onLoad = function() {
      raster.fitBounds(view.bounds);
      paper.canvas.mainLayer.opacity = 0.1;
      paper.resetSpiral();
      $('#pause').prop('disabled', true);
    }
  } catch(e) {
    console.error('Problem loading image:', path, e);
  }
};

paperLoadedInit();
