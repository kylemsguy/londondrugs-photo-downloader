/**
 * Only creates the download button where the "download" button is
 * TODO: style and make sure it doesn't overlap the actual download button
 */
const dbutton = document.getElementsByClassName('btn-download')[0];
const navRight = dbutton.parentElement.parentElement.parentElement;

function downloadAll(){
    const evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("initiateDownload", true, true, null);
    document.dispatchEvent(evt);
}

const btnDownloadAll = document.createElement("button");
btnDownloadAll.innerText = "Download All!";
btnDownloadAll.onclick = downloadAll;

navRight.appendChild(btnDownloadAll);