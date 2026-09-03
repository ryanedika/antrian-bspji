const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwDYTi20nqexFTYIwVDpOJufkoq8iiuDtQNGyVcYzv1E07yT2OzSJTZxURS77zXEims7w/exec";

// ========================================
// CEK NOMOR LOKET A
// ========================================
function cekLoketA() {

    const callbackName = "tvCallbackA_" + Date.now();

    window[callbackName] = function(data) {

        console.log("Data TV Loket A:", data);

        const nomor = document.getElementById("nomorTV_A");
        const layanan = document.getElementById("layananTV_A");

        if (data.success && data.nomor) {
            nomor.textContent = data.nomor;
            layanan.textContent = data.layanan;
        } else {
            nomor.textContent = "-";
            layanan.textContent = "Menunggu Antrian Selanjutnya";
        }

        delete window[callbackName];
    };

    const script = document.createElement("script");

    script.src =
        SCRIPT_URL +
        "?action=current" +
        "&loket=A" +
        "&callback=" + callbackName;

    document.body.appendChild(script);
}


// ========================================
// CEK NOMOR LOKET B
// ========================================
function cekLoketB() {

    const callbackName = "tvCallbackB_" + Date.now();

    window[callbackName] = function(data) {

        console.log("Data TV Loket B:", data);

        const nomor = document.getElementById("nomorTV_B");
        const layanan = document.getElementById("layananTV_B");

        if (data.success && data.nomor) {
            nomor.textContent = data.nomor;
            layanan.textContent = data.layanan;
        } else {
            nomor.textContent = "-";
            layanan.textContent = "Menunggu Antrian Selanjutnya";
        }

        delete window[callbackName];
    };

    const script = document.createElement("script");

    script.src =
        SCRIPT_URL +
        "?action=current" +
        "&loket=B" +
        "&callback=" + callbackName;

    document.body.appendChild(script);
}


// ========================================
// CEK NOMOR LOKET C
// ========================================
function cekLoketC() {

    const callbackName = "tvCallbackC_" + Date.now();

    window[callbackName] = function(data) {

        console.log("Data TV Loket C:", data);

        const nomor = document.getElementById("nomorTV_C");
        const layanan = document.getElementById("layananTV_C");

        if (data.success && data.nomor) {
            nomor.textContent = data.nomor;
            layanan.textContent = data.layanan;
        } else {
            nomor.textContent = "-";
            layanan.textContent = "Menunggu Antrian Selanjutnya";
        }

        delete window[callbackName];
    };

    const script = document.createElement("script");

    script.src =
        SCRIPT_URL +
        "?action=current" +
        "&loket=C" +
        "&callback=" + callbackName;

    document.body.appendChild(script);
}


// ========================================
// JALANKAN SAAT HALAMAN DIBUKA
// ========================================
cekLoketA();
cekLoketB();
cekLoketC();


// ========================================
// UPDATE SETIAP 2 DETIK
// ========================================
setInterval(function() {
    cekLoketA();
    cekLoketB();
    cekLoketC();
}, 2000);


// ========================================
// TANGGAL DAN HARI
// ========================================

function tampilkanTanggalTV() {

    const sekarang = new Date();

    const hari = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ];

    const bulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ];

    const namaHari =
        hari[sekarang.getDay()];

    const tanggal =
        sekarang.getDate();

    const namaBulan =
        bulan[sekarang.getMonth()];

    const tahun =
        sekarang.getFullYear();


    document.getElementById(
        "tanggalHariTV"
    ).textContent =
        namaHari +
        ", " +
        tanggal +
        " " +
        namaBulan +
        " " +
        tahun;
}


// Jalankan saat halaman dibuka

tampilkanTanggalTV();