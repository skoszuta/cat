const LEFT_PUPIL_INITIAL_OFFSET_X_PERCENT = 0.315
const RIGHT_PUPIL_INITIAL_OFFSET_X_PERCENT = 0.665
const PUPIL_INITIAL_OFFSET_Y_PERCENT = 0.455
const PUPIL_TO_HEAD_WIDTH_RATIO = 0.05
const NOSE_POSE_CODE = 0
const LEFT_EAR_POSE_CODE = 3
const RIGHT_EAR_POSE_CODE = 4
const MAX_GAZE_OFFSET_X = 0.05
const MAX_GAZE_OFFSET_Y = 0.03

const Scene = {
  headContainer: document.createElement('div'),
  headline: document.createElement('div'),
  head: null,
  leftPupil: null,
  rightPupil: null,
  currentState: null,
  draw(state = Scene.currentState) {
    Scene.currentState = state

    if (!state.poses || !state.poses.length) {
      positionPupils()
      return
    }

    const nosePosition = state.poses[0].keypoints[NOSE_POSE_CODE]

    const noseXVsCenter = (nosePosition.x - 320) / 320
    const signumX = noseXVsCenter > 0 ? 1 : -1
    const gazeOffsetX =
      signumX * noseXVsCenter * noseXVsCenter * MAX_GAZE_OFFSET_X

    const noseYVsCenter = (nosePosition.y - 240) / 240
    const signumY = noseYVsCenter > 0 ? 1 : -1
    const gazeOffsetY =
      signumY * noseYVsCenter * noseYVsCenter * MAX_GAZE_OFFSET_Y

    positionPupils(-gazeOffsetX, gazeOffsetY)

    if (Math.abs(noseXVsCenter) <= 0.3) {
      const leftEarPosition = state.poses[0].keypoints[LEFT_EAR_POSE_CODE]
      const rightEarPosition = state.poses[0].keypoints[RIGHT_EAR_POSE_CODE]
      const headAngle =
        (Math.atan2(
          leftEarPosition.y - rightEarPosition.y,
          leftEarPosition.x - rightEarPosition.x
        ) *
          180) /
        Math.PI * -1
      rotateHead(headAngle)
    } else {
      rotateHead()
    }
  },
  init(state) {
    Scene.currentState = state

    document.title = 'Merry Christmas!'

    Scene.headContainer.classList.add('head-container')
    document.body.appendChild(Scene.headContainer)

    Object.assign(Scene, {
      head: state.images.head.cloneNode(true),
      leftPupil: state.images.pupil.cloneNode(true),
      rightPupil: state.images.pupil.cloneNode(true),
    })

    Scene.head.classList.add('svg-head')
    Scene.leftPupil.classList.add('svg-left-pupil')
    Scene.rightPupil.classList.add('svg-right-pupil')

    Scene.headContainer.appendChild(Scene.head)
    Scene.headContainer.appendChild(Scene.leftPupil)
    Scene.headContainer.appendChild(Scene.rightPupil)

    positionPupils()

    Scene.headline.classList.add('headline')
    document.body.appendChild(Scene.headline)
    Scene.headline.innerText = 'Merry Christmas!'

    window.addEventListener('resize', () => requestAnimationFrame(Scene.draw))
  },
}

function positionPupils(offsetX = 0, offsetY = 0) {
  if (offsetX > MAX_GAZE_OFFSET_X || offsetX < -MAX_GAZE_OFFSET_X) {
    offsetX = offsetX > 0 ? MAX_GAZE_OFFSET_X : -MAX_GAZE_OFFSET_X;
  }

  Scene.leftPupil.style.left = `${
    Scene.head.offsetLeft +
    Scene.head.width * (LEFT_PUPIL_INITIAL_OFFSET_X_PERCENT + offsetX)
  }px`
  Scene.leftPupil.style.top = `${
    Scene.head.offsetTop +
    Scene.head.height * (PUPIL_INITIAL_OFFSET_Y_PERCENT + offsetY)
  }px`
  Scene.leftPupil.style.width = `${
    Scene.head.width * PUPIL_TO_HEAD_WIDTH_RATIO
  }px`

  Scene.rightPupil.style.left = `${
    Scene.head.offsetLeft +
    Scene.head.width * (RIGHT_PUPIL_INITIAL_OFFSET_X_PERCENT + offsetX)
  }px`
  Scene.rightPupil.style.top = `${
    Scene.head.offsetTop +
    Scene.head.height * (PUPIL_INITIAL_OFFSET_Y_PERCENT + offsetY)
  }px`
  Scene.rightPupil.style.width = `${
    Scene.head.width * PUPIL_TO_HEAD_WIDTH_RATIO
  }px`
}

function rotateHead(angle = 0) {
  if (angle > 20 || angle < -20) {
    Scene.headContainer.style.transform = `rotate(${angle}deg)`
  } else {
    Scene.headContainer.style.transform = `rotate(0deg)`
  }
}

export default Scene
