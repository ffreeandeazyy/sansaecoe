# . . . s a n s a e c o e . . .

산새코에 웹사이트 시안입니다. 흰 도화지 위에 작은 사물 사진들이 흩어져 있고, 하나를 누르면 그 이야기가 종이처럼 올라옵니다.

## 여는 방법

`index.html` 파일을 더블클릭하면 브라우저에서 바로 열립니다. 서버나 인터넷 연결이 필요 없고, 모든 사진이 이 폴더 안에 들어 있습니다.

## 폴더 구성

```
sansaecoe-site/
  index.html        사이트 전체 (사물 7개 + 각 이야기)
  style.css         색, 글자, 여백, 움직임
  script.js         사물을 눌렀을 때 종이가 열리고 닫히는 동작
  assets/           사진과 아이콘 (모두 로컬 파일)
```

## 사진 바꾸기

`assets/` 안의 파일을 같은 이름으로 덮어쓰면 됩니다.

| 파일 | 쓰이는 곳 |
| --- | --- |
| `hero.jpg` | 첫 화면의 폴라로이드 (About us…) |
| `icon-hukui.png` | 후쿠이 히요코 잔 |
| `icon-viewfinder.png` | 산새코에 뷰파인더 |
| `icon-cloudstone.jpg` | 구름일까 돌멩일까 |
| `icon-rental.png` | 대관 안내 |
| `icon-cookiebox.png` | 쿠키박스 |
| `icon-inquiry.jpg` | 기타 문의 및 제안 |
| `about-night.jpg` | About us… 안의 밤 사진 |
| `hukui-1.jpg`, `hukui-2.jpg` | 후쿠이 잔 안의 사진 두 장 |
| `viewfinder.png`, `viewfinder-demo.gif` | 뷰파인더 안의 사진과 움직이는 화면 |

## 글자 고치기

`index.html`을 메모장 같은 편집기로 열면 `<template id="t-about">` 처럼 이야기마다 묶음이 있습니다. 그 안의 글자만 바꾸면 사이트에 바로 반영됩니다. (`<p>` 와 `</p>` 사이의 글자가 화면에 보이는 문장입니다.)

## 사물 위치 옮기기

각 사물은 `index.html` 안의 `style="--x:6%; --y:3%; --w:...; --r:-3.5deg"` 값으로 자리를 잡습니다.

- `--x`, `--y` : 도화지 안에서의 가로·세로 위치 (%)
- `--w` : 사진 크기
- `--r` : 살짝 기울어진 각도 (About us 사진은 `0deg` 로 똑바로)
- `--wm` : 좁은 화면(휴대폰)에서의 사진 크기
- `--shift` : 좁은 화면에서 좌우로 살짝 밀어 둘 거리

About us 사진(`assets/hero.jpg`)은 글자 없이 사진만 놓여 있고, 사진을 누르면 이야기가 열립니다. 사진 아래 글자를 다시 보이게 하려면 `style.css` 의 `.item--print .cap { display: none; }` 를 지우면 됩니다.
