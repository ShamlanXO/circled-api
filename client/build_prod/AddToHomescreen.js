const iOSShareBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAActpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgSW1hZ2VSZWFkeTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KKS7NPQAAAsxJREFUSA2lVjFrFFEQnnm7l2iiF2LuEggWImchFjb5B4KFhZ3+AC1io1hZJedyYGNjERANaB9FG0FBBGuLIBamukYQRXN4GnKSy+6+cebt283buz3dmIF3O2/ezHwz82ZnD+BfdIm8VKW+vLsmK92Dc5bJ9sUEpFL9+nL4bPYOkSzhUzk4OpnMYdDh86wYBqjFQU1HrxGoDoA9qzRBAJ2O8s+nOuaZ92B2xQBECIh0JqCxbzp6yUpnp7r+8a1j8WMADdUfn678mj7xmUE+zCn/wscAd8HaDGJkJRg8kH0XvvqI8A6VPtdewT6LjrCfo+2VU32RyVkXwC+yHSHjyCUSWQW1rTej57KGjEU3tQO2dchBlwMk2DvmCpQkc1eurvXFogTgCbfiZYxrSzsXUal7DBQDmPaMEPiOgR51WpVbLMsCqjXDuwrwKoHuAChuZdJiQ6Budlr4AqzPxOANyF3EgF6DL/ckkb7GNpMQx2I0gYjvJT5OjvcJcRe8JaKfnOZv8FCB1j1E7wEQNIyG9ZkAzLNYCBUh6Y3N1thDsx/4YaUMYLPlv+JjWRnNNsMbnEGytz6zlFMtjuqw4blF4UsC3BgHJV1Ezg01rtN4u28B5zk5blVju3eHxk0egDRnbrO5DaG8C6LVDpLac6mSTEU2wyUNMDJeTNcxJ7biw6E8gHNQxHKEOeMiHSmzK98XACobsethkD9gBtOD/ob2/5mB6R6llPsWZx01BOIIypXITtXvAd43tumkdRyNYssBiLWApB+YQN70clQeQPw9Le84hf/ruE6VDvLMZ2A6wLbx4rrPA6vURcLiugQa8tAbiiUPwOORh1ZS39WFEFaH9EcJEhsSW/4MOZQDQB2LQnVmiU77GFYjz44Nx6CI9XkOR1TZ4t8qT4sEzCrmAFi2rSb9OdyBDVIVyP6vFHl1ZPLl8LiYeMgH3Qu3nSP4A9EHFXrGnVaNAAAAAElFTkSuQmCC'
const closeBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAl0lEQVR4Ae2TMQ6DMBTFfA+kHqkSUmcKgd5/BIaEqsOfWqyILgx4jewl/3FxSm74q8ODlcQeL1Za769sFNKOXthYaBAS5Wci9ExH4AlG143xKxH6k0oiMbluTEQi9B5BEpW6fNtHH+CfQCEd13PcxVF9IHnC9V6us1qvTsjVScJ1SeicM53MbKZBaFlkcYmZO473aTghF2/X9XbQ39L36gAAAABJRU5ErkJggg=='
const addIcon =
    'iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAACXBIWXMAAAsTAAALEwEAmpwYAAABUUlEQVR4Aa1US1LCQBB9M2BhuXGOEHdWAVXxBnMDWQnlBjgBxQ3wBnACcKO48wbMDWRhyqV6gyzRaMY3iZ+IiSiVVzXV6cn0S3fP6wgQvu54EexAAD0LKGyEXQJyEpj5zHninWBBAhUD5xIi3EgB26XxeH54Z67Goq47U273gMpRYC6W6wG+bqmluf5B3NDtBbP2d/B0IAWsz4RMHkFTn7SeUZvlZcO4CY2KsOfJtAf2AbmQSkDsI7ckGaZksZIoAaWQVLMOmzVwzfrweQsejV/X7Wn2HJs5fCnKhHUKV+XXShB+3xNYYVcVZhKYy3HWb+qOE1+XoupjDQ3qKzeTbVEOiUhqhpf/Oi4cAaePT4e1jdh9W9enPv4Bxiy47t1ztYrVOEKNA/V6w80ZFfr4WzCvnQq2GokURD/NijhkpyvAiPNw/JdfAT9kaM5uzdxZvAH9imfTiUiFUgAAAABJRU5ErkJggg=='
const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    display:none;
z-index:40000;
  position: absolute;
  bottom: 20px;
  box-shadow: 20px 50px 300px #000;
  left: 50%;
  background-color: #fff;
  transform: translateX(-50%);
  color: #2B4057;
  border-radius:8px;

}



#install {
 
  padding: 16px;
  background: #fff;
  width: 280px;
  border-radius:8px;
  line-height: 30px;
  z-index:2000
}

#share {
  vertical-align: top;
}
#addIcon {
   
    vertical-align: -3px;
  }

#arrowOuter {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 0px solid #333;
 
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

#arrowInner {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 20px solid #fff;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -19px;
}

#close {
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  padding: 12px;
  cursor: pointer;
}
#popheader{
padding-bottom:0px;
font-size:18px;
font-weight:bold;
}
</style>
<div id="install">
<div id="popheader">Before you start!!</div>
Add circled to your home screen for the best experience.<br/>
Click on <img id="share" src="data:image/png;base64,${iOSShareBase64}"> and then scroll down and click on
&nbsp;" Add to Home Screen &nbsp;<img id="addIcon"  src="data:image/png;base64,${addIcon}"> &nbsp;" 

</div>
<div id="arrowOuter"></div>
<div id="arrowInner"></div>
<img id="close" src="data:image/png;base64,${closeBase64}">
`

export default class AddToHomeScreen extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this._closeClick = closeClick.bind(this)
    }

    connectedCallback() {
        const ua = window.navigator.userAgent
        const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i)
        const webkit = !!ua.match(/WebKit/i)
        const iOSSafari = iOS && webkit && !ua.match(/CriOS/i)

        if (iOSSafari && !navigator.standalone) {
            this.style.display = 'inline-block'
            this.shadowRoot
                .getElementById('close')
                .addEventListener('click', this._closeClick)
        }
    }

    disconnectedCallback() {
        this.shadowRoot
            .getElementById('close')
            .removeEventListener('click', this._closeClick)
    }
}

function closeClick() {
    this.style.display = 'none'
}

window.customElements.define('add-to-home-screen', AddToHomeScreen)
