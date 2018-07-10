window.addEventListener("load", main, false);
window.addEventListener("initiateDownload", function (e)
{
    download();
});

function main(){
    var jsInitChecktimer = setInterval(checkLoaded, 111);

    function checkLoaded(){
        let dbutton = document.getElementsByClassName('btn-download')[0];
        // console.log(dbutton);
        
        if(dbutton){
            clearInterval(jsInitChecktimer);
            const s = document.createElement('script');
            s.src = chrome.extension.getURL('download-all-button.js');
            s.onload = function() {
                this.remove();
            };
            (document.head || document.documentElement).appendChild(s);
        }
    }
}

function download(){
    const selectNoneButton = document.getElementsByClassName('btn-select-none')[0];
    const dbutton = document.getElementsByClassName('btn-download')[0];
    const previews = document.getElementsByClassName('preview');

    const filename_map = {};

    selectNoneButton.click();

    for(let i = 0; i < previews.length; i++){
        const p = previews[i];
        p.click();
        let url = dbutton.href;
        let filename = p.children[0].alt;
        filename_map[filename] = url;
        selectNoneButton.click();
    }
    // console.log(filename_map);

    const zip = new JSZip();
    const photoZip = zip.folder("photos");

    const promises = []

    for(let prop in filename_map){
        if(!filename_map.hasOwnProperty(prop)) continue;

        const url = filename_map[prop];
        // 1) get a promise of the content
        var promise = new JSZip.external.Promise(function (resolve, reject) {
            JSZipUtils.getBinaryContent(url, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        promises.push(promise);

        promise.then(function(img) {
            // console.log(prop);
            return photoZip.file(prop, img); // 3) chain with the text content promise
        })
        .then(function success(text) {                    // 4) display the result
            // console.log("Successfully added file " + prop + " to the zip");
        }, function error(e) {
            console.log("Failed to save " + prop);
            console.log(e);
        });
    }

    Promise.all(promises).then(function(){
        zip.generateAsync({
            type:"blob", 
            compression: "DEFLATE"
        }).then(function (blob) { // 1) generate the zip file
            saveAs(blob, "photos.zip");                          // 2) trigger the download
            // const fileStream = streamSaver.createWriteStream('photos.zip', blob.size);
            // blob.stream().pipeTo(fileStream);
        }, function (err) {
            alert("Failed. See the log for details.");
            console.log(err);
        });
    });
}