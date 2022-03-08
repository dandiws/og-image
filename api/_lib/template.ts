import { readFileSync } from 'fs'
import { marked } from 'marked'
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'
const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)
import simpleIcons from 'simple-icons'

const rglr = readFileSync(
  `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString('base64')
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
  'base64'
)
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  'base64'
)
const headingBold = readFileSync(
  `${__dirname}/../_fonts/LeagueSpartan-Bold.woff2`
).toString('base64')

const footerText = process.env.FOOTER_TEXT || 'dandiws.vercel.app'

function getCss (theme: string, fontSize: string) {
  const dark = {
    100: '#17181e',
    200: '#101215'
  }

  let background = 'white'
  let foreground = dark[200]
  let radial = 'lightgray'

  if (theme === 'dark') {
    background = dark[200]
    foreground = 'white'
    radial = 'dimgray'
  }
  return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'League Spartan';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${headingBold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }
      

    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 2rem 10rem;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .svg-wrapper svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
        margin: 0 1.75rem;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'League Spartan', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.25;
    }
    
    .footer {
        font-family: 'Vera', sans-serif;
        font-size: 2.5rem;
        color: ${foreground};
        position: absolute;
        bottom: 4rem;
    }`
}

export function getHtml (parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, images } = parsedReq
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
    <div class="logo-wrapper">
        ${renderImages(images)}
    </div>
    <div class="heading">
        ${emojify(md ? marked(text) : sanitizeHtml(text))}
    </div>
    <div class="footer">${footerText}</div>
    </body>
</html>`
}

function renderImages (images: string[]) {
  return images
    .filter(img => Boolean(img))
    .map(img => getImage(img))
    .filter(img => Boolean(img))
    .map((img, i) => getPlusSign(i) + img)
    .join('')
}

function getImage (src: string, _width = 'auto', _height = '225') {
  if (!src) {
    return ''
  }

  let icon = simpleIcons.Get(src)

  if (!icon) {
    return ''
  }

  return `
    <div class="svg-wrapper" style="width:${200}px;height: ${200}px;">
      ${icon.svg}
    </div>
  `
}

function getPlusSign (i: number) {
  return i === 0 ? '' : '<div class="plus">+</div>'
}
