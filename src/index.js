import './styles.scss'
import '@tensorflow/tfjs-backend-webgl'
import * as poseDetection from '@tensorflow-models/pose-detection'
import Scene from './components/scene/scene'
import loadImageAsync from './services/loadImageAsync'

const CAMERA_CONFIG = {
  audio: false,
  video: {
    facingMode: 'user',
    width: 640,
    height: 480,
    frameRate: 60,
  },
}

const state = {
  detector: null,
  stream: null,
  imageCapture: null,
  poses: null,
  images: {
    head: null,
    pupil: null,
  },
}

async function run() {
  if (state.imageCapture.track.muted) {
    return
  }

  const imageBitmap = await state.imageCapture.grabFrame()
  const poses = await state.detector.estimatePoses(imageBitmap)
  state.poses = poses

  Scene.draw(state)

  requestAnimationFrame(run)
}

async function main() {
  const model = poseDetection.SupportedModels.MoveNet
  const detector = await poseDetection.createDetector(model)
  const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG)
  const imageCapture = new ImageCapture(stream.getVideoTracks()[0])

  state.detector = detector
  state.stream = stream
  state.imageCapture = imageCapture
  state.images.head = await loadImageAsync('head.svg')
  state.images.pupil = await loadImageAsync('pupil.svg')

  Scene.init(state)

  requestAnimationFrame(run)
}

main()
