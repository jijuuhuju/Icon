const input = document.getElementById("inputText");
const generate = document.getElementById("generate");
const icon = document.getElementById("icon");

let currentSVG = "";


// 文字列を数値へ変換
function stringToNumber(str) {
  let num = 0;

  for (let i = 0; i < str.length; i++) {
    num = (num * 31 + str.charCodeAt(i)) % 1000000000;
  }

  return num;
}


// 数値から色を作成
function createColor(num) {

  const hue = num % 360;
  const saturation = 60 + (num % 30);
  const lightness = 40 + (num % 20);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}


// 数字から図形を決定
function getShape(value) {

  const type = value % 10;

  if (
    type === 1 ||
    type === 4 ||
    type === 7
  ) {
    return "square";
  }


  if (
    type === 2 ||
    type === 5 ||
    type === 8
  ) {
    return "circle";
  }


  return "none";
}



// アイコン生成
function createIcon(value) {

  icon.innerHTML = "";


  let num;


  // 数字だけならそのまま使用
  if (/^[0-9]+$/.test(value)) {

    num = Number(value);

  } else {

    num = stringToNumber(value);

  }



  const color = createColor(num);


  const size = 50;


  let pattern = [];



  // 左半分3列を作成
  for (let y = 0; y < 5; y++) {

    pattern[y] = [];


    for (let x = 0; x < 3; x++) {


      num = (
        num * 1103515245 + 12345
      ) % 2147483648;


      pattern[y][x] = num % 10;

    }

  }



  // 左右対称に描画
  for (let y = 0; y < 5; y++) {


    for (let x = 0; x < 5; x++) {


      let sourceX;


      if (x < 3) {

        sourceX = x;

      } else {

        sourceX = 4 - x;

      }



      const shape = getShape(
        pattern[y][sourceX]
      );



      if (shape === "square") {


        const rect =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
          );


        rect.setAttribute(
          "x",
          x * size
        );

        rect.setAttribute(
          "y",
          y * size
        );

        rect.setAttribute(
          "width",
          size
        );

        rect.setAttribute(
          "height",
          size
        );

        rect.setAttribute(
          "fill",
          color
        );


        icon.appendChild(rect);

      }



      if (shape === "circle") {


        const circle =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );


        circle.setAttribute(
          "cx",
          x * size + size / 2
        );


        circle.setAttribute(
          "cy",
          y * size + size / 2
        );


        circle.setAttribute(
          "r",
          size / 2
        );


        circle.setAttribute(
          "fill",
          color
        );


        icon.appendChild(circle);

      }

    }

  }



  currentSVG =
    new XMLSerializer()
      .serializeToString(icon);

}



// ボタン
generate.onclick = () => {

  createIcon(
    input.value
  );

};


// 初期アイコン
createIcon("hello");
