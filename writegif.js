var GifEncoder = require("gif-encoder")
var concat = require("terminus").concat

module.exports = writegif

// something with GifEncoder isn't correctly resetting the
// state of backpressure it seems like?
var hwm = 128 * 100 * 1024 // HUGE

// default = 10, 200 is maybe a bit smaller sometimes
var quality = 200

function writegif(image, callback) {
  var out = concat(function (buffer) {
    callback(null, buffer)
  })

  console.log('GifEncoder:before', process.memoryUsage())
  var gif = new GifEncoder(image.width, image.height, {highWaterMark: hwm})
  console.log('GifEncoder:after', process.memoryUsage())

  console.log('gif.pipe:before', process.memoryUsage())
  gif.pipe(out)
  console.log('gif.pipe:after', process.memoryUsage())

  console.log('gif.writeHeader:before', process.memoryUsage())
  gif.writeHeader()
  console.log('gif.writeHeader:after', process.memoryUsage())
  console.log('gif.setQuality:before', process.memoryUsage())
  gif.setQuality(quality)
  console.log('gif.setQuality:after', process.memoryUsage())


  if (image.frames.length > 1) {
    gif.setRepeat(0)
  }

  console.log('image.frames.forEach:before', process.memoryUsage())
  image.frames.forEach(function (frame) {
    console.log('image.frames.forEach:enter', process.memoryUsage())
    if (frame.delay) {
      console.log('gif.setDelay:before', process.memoryUsage())
      gif.setDelay(frame.delay)
      console.log('gif.setDelay:after', process.memoryUsage())
    }
    console.log('gif.addFrame:before', process.memoryUsage())
    gif.addFrame(frame.data)
    console.log('gif.addFrame:after', process.memoryUsage())
    console.log('image.frames.forEach:leave', process.memoryUsage())
  })
  console.log('image.frames.forEach:after', process.memoryUsage())

  console.log('gif.finish:before', process.memoryUsage())
  gif.finish()
  console.log('gif.finish:after', process.memoryUsage())
}
