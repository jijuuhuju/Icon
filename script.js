const input = document.getElementById("inputText");
const generate = document.getElementById("generate");
const icon = document.getElementById("icon");

let currentSVG = "";


// 文字を数値へ変換
function stringToNumber(str) {
  let num = 0;

  for (let i = 0; i < str.length; i++) {
    num = (num * 31 + str.charCodeAt(i)) % 1000000000;
  }

  return num;
}


// 数値から色生成
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

  // 背景透明
  icon.style.background = "transparent";


  let num;


  // 数値なら直接使用
  if (/^[0-9]+$/.test(value)) {

    num = Number(value);

  } else {

    num = stringToNumber(value);

  }


  const color = createColor(num);


  const size = 50;


  let pattern = [];


  // 左3列を作る
  for (let y = 0; y < 5; y++) {

    pattern[y] = [];


    for (let x = 0; x < 3; x++) {


      num =
        (num * 1103515245 + 12345)
        % 2147483648;


      pattern[y][x] =
        num % 10;

    }
  }



  // 左右対称で描画
  for (let y = 0; y < 5; y++) {


    for (let x = 0; x < 5; x++) {


      let sourceX;


      if (x < 3) {

        sourceX = x;

      } else {

        sourceX = 4 - x;

      }



      const shape =
        getShape(
          pattern[y][sourceX]
        );



      // 四角
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



      // 丸
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



// 生成ボタン
generate.onclick = () => {

  createIcon(
    input.value
  );

};




// SVGダウンロード
document.getElementById("downloadSVG").onclick = () => {


  const blob =
    new Blob(
      [currentSVG],
      {
        type: "image/svg+xml"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const a =
    document.createElement("a");


  a.href = url;

  a.download =
    "icon.svg";


  a.click();


  URL.revokeObjectURL(url);

};





// 透明PNGダウンロード
document.getElementById("downloadPNG").onclick = () => {


  const svgData =
    new XMLSerializer()
      .serializeToString(icon);



  const canvas =
    document.createElement("canvas");


  canvas.width = 250;
  canvas.height = 250;


  const ctx =
    canvas.getContext("2d");



  const img =
    new Image();



  const blob =
    new Blob(
      [svgData],
      {
        type: "image/svg+xml"
      }
    );


  const url =
    URL.createObjectURL(blob);



  img.onload = () => {


    // 背景を書かず透明維持
    ctx.drawImage(
      img,
      0,
      0
    );


    URL.revokeObjectURL(url);



    const png =
      canvas.toDataURL(
        "image/png"
      );


    const a =
      document.createElement("a");


    a.href = png;


    a.download =
      "icon-transparent.png";


    a.click();

  };


  img.src = url;

};



// 最初の表示
createIcon("hello");
