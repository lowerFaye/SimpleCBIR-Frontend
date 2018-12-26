const { ipcRenderer } = require('electron');
const os = require('os');
const fs = require('fs');

const selectImgBtn = document.getElementById('btn1');
const selectedImg = document.getElementById('selected');

selectImgBtn.addEventListener('click', (event) => {
    ipcRenderer.send('open-image-dialog');
});

ipcRenderer.on('selected-image', (e, img) => {
    selectedImg.src = img[0];
    pM = document.getElementById('methodA').getElementsByClassName("selected")[0];
    fM = document.getElementById('methodB').getElementsByClassName("selected")[0];
    tM = document.getElementById('methodC').getElementsByClassName("selected")[0];
    sM = document.getElementById('methodD').getElementsByClassName("selected")[0];
    const data={
        path: img[0],
        preprocessMethod: pM.dataset.value,
        featureExtractionMethod: fM.dataset.value,
        similarityCalculationMethod: sM.dataset.value,
        positionMethod: tM.dataset.value
    }



    fs.access(os.tmpdir() + "\\SimpleCBIR_ResultTemp\\result.json", fs.constants.F_OK, (err) => {
        if(err){
            return;
        }
        fs.unlinkSync(os.tmpdir() + "\\SimpleCBIR_ResultTemp\\result.json");
        console.log("delete")
      })

    document.getElementsByClassName("ribbon label")[0].innerText = "处理中...";

    fetch('http://localhost:8000/api/start',{
        method: 'POST',
        body:JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(res => console.log(res))
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response))
    .then(() => {
        const busyFile = os.tmpdir() + "\\SimpleCBIR_ResultTemp\\result.json.busy";
        const resultFile = os.tmpdir() + "\\SimpleCBIR_ResultTemp\\result.json";

        setInterval(fs.access(busyFile, fs.constants.F_OK, (err) => {
                if(err){
                    console.log("处理中.");
                    return;
                }
                flag1=false;
                clearInterval(500);
                setInterval(fs.access(busyFile, fs.constants.F_OK, (err) => {
                    if(err){
                        flag2=false;
                        clearInterval(500);
                    }
                    console.log("写入中.");
                  }),500);
              }), 500);

        fs.readFile(resultFile, (err, data) => {
            if (err) throw err;
            document.getElementsByClassName("ribbon label")[0].innerText = "处理结束";
            data = JSON.parse(data);
            console.log(data);
            let spans = document.getElementsByTagName('span');
            spans[0].innerHTML = data.precision;
            spans[1].innerHTML = data.recallRatio;
            spans[2].innerHTML = data.results.one.similarity;
            spans[3].innerHTML = data.results.two.similarity;
            spans[4].innerHTML = data.results.three.similarity;
            document.getElementById('selected_color').src = data.features.color;
            document.getElementById('selected_texture').src = data.features.texture;
            document.getElementById('selected_shape').src = data.features.shape;
            document.getElementById('selected_position').src = data.features.position;
            document.getElementById('res_img1').src = data.results.one.path;
            document.getElementById('color_img1').src = data.results.one.features.color;
            document.getElementById('texture_img1').src = data.results.one.features.texture;
            document.getElementById('shape_img1').src = data.results.one.features.shape;
            document.getElementById('res_img2').src = data.results.two.path;
            document.getElementById('color_img2').src = data.results.two.features.color;
            document.getElementById('texture_img2').src = data.results.two.features.texture;
            document.getElementById('shape_img2').src = data.results.two.features.shape;
            document.getElementById('res_img3').src = data.results.three.path;
            document.getElementById('color_img3').src = data.results.three.features.color;
            document.getElementById('texture_img3').src = data.results.three.features.texture;
            document.getElementById('shape_img3').src = data.results.three.features.shape;
            document.getElementById('position_img3').src = data.results.three.features.position;
            document.getElementById('position_img2').src = data.results.two.features.position;
            document.getElementById('position_img1').src = data.results.one.features.position;
            document.getElementsByClassName("ribbon label")[0].innerText = "处理结束";

        });
    });
});
