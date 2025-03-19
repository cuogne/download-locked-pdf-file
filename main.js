// how to use
// 1: Open file .pdf that you want download on google drive
// 2: Scroll down to the bottom of the pdf file to fully load all pages
// 3: Press F12 on keyboard, click "Console" on DevTool and paste the script below into the console

// Actually it just exports pdf files as scanned images ;-;

let jspdf = document.createElement("script");

jspdf.onload = function () {
    let pdf = new jsPDF();
    let elements = document.getElementsByTagName("img");

    for (let i = 0; i < elements.length; i++) {
        let img = elements[i];
        if (!/^blob:/.test(img.src)) {
            continue; // Bỏ qua các ảnh không phải blob
        }

        let can = document.createElement('canvas');
        let con = can.getContext('2d');
        // lay kich thuoc goc
        can.width = img.naturalWidth;
        can.height = img.naturalHeight;
        con.drawImage(img, 0, 0, can.width, can.height);

        let imgData = can.toDataURL("image/jpeg", 1.0);

        // Tính toán tỷ lệ để ảnh vừa với trang PDF
        let pdfWidth = pdf.internal.pageSize.getWidth();
        let pdfHeight = pdf.internal.pageSize.getHeight();
        let imgRatio = can.width / can.height;
        let pdfRatio = pdfWidth / pdfHeight;

        let renderWidth, renderHeight;
        if (imgRatio > pdfRatio) {
            // Ảnh rộng hơn, căn theo chiều ngang
            renderWidth = pdfWidth;
            renderHeight = pdfWidth / imgRatio;
        } else {
            // Ảnh cao hơn, căn theo chiều dọc
            renderHeight = pdfHeight;
            renderWidth = pdfHeight * imgRatio;
        }

        // Căn giữa ảnh trên trang PDF
        let xOffset = (pdfWidth - renderWidth) / 2;
        let yOffset = (pdfHeight - renderHeight) / 2;

        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, renderWidth, renderHeight);

        // Thêm trang mới nếu không phải ảnh cuối cùng
        if (i < elements.length - 1) {
            pdf.addPage();
        }
    }

    pdf.save(document.title.split('.pdf - ')[0] + ".pdf");
};

jspdf.src = "https://gdrive.vip/wp-content/uploads/2020/jspdf.debug.js";
document.body.appendChild(jspdf);