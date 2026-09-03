const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwDYTi20nqexFTYIwVDpOJufkoq8iiuDtQNGyVcYzv1E07yT2OzSJTZxURS77zXEims7w/exec";


// ========================================
// STATUS REQUEST
// ========================================

const requestAktif = {
    A: {
        next: false,
        finish: false,
        queue: false,
        current: false
    },

    B: {
        next: false,
        finish: false,
        queue: false,
        current: false
    },

    C: {
        next: false,
        finish: false,
        queue: false,
        current: false
    }
};

// ========================================
// TAMPILKAN LAYANAN
// ========================================

function tampilkanLayananLoket(loket, layanan) {

    const element =
        document.getElementById(
            "layananLoket" + loket
        );

    if (!element) {
        return;
    }

    element.textContent =
        layanan || "LAYANAN";
}

// ========================================
// PANGGIL BERIKUTNYA
// ========================================

function panggilBerikutnya(loket) {

    if (requestAktif[loket].next) {
        return;
    }

    requestAktif[loket].next = true;

    const callbackName =
        "nextCallback_" +
        loket +
        "_" +
        Date.now();

    const btnPanggil =
        document.getElementById(
            "btnPanggil" + loket
        );

    const btnSelesai =
        document.getElementById(
            "btnSelesai" + loket
        );

    btnPanggil.disabled = true;

    let requestSelesai = false;

    let script;

    const timeout =
        setTimeout(function() {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;

            console.error(
                "Request next timeout:",
                loket
            );

            alert(
                "Server tidak merespons. Silakan coba lagi."
            );

            bersihkanRequest();

            requestAktif[loket].next = false;

            btnPanggil.disabled =
                btnSelesai.disabled === false;

        }, 5000);


    function bersihkanRequest() {

        clearTimeout(timeout);

        delete window[callbackName];

        if (
            script &&
            script.parentNode
        ) {

            script.parentNode.removeChild(
                script
            );

        }

    }


    window[callbackName] =
        function(data) {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;

            console.log(
                "Nomor dipanggil " + loket + ":",
                data
            );

            const nomorElement =
                document.querySelector(
                    "#nomorSekarang" + loket + " h1"
                );
            
            if (
                data &&
                data.success &&
                data.nomor
            ) {
                
                nomorElement.textContent =
                    data.nomor;
                
                tampilkanLayananLoket(
                    loket,
                    data.layanan
                );
                
                btnPanggil.disabled =
                    true;
                
                btnSelesai.disabled =
                    false;
            
            } else {

                alert(
                    data && data.message
                        ? data.message
                        : "Tidak ada antrean yang menunggu."
                );

            }


            bersihkanRequest();

            requestAktif[loket].next =
                false;

            tampilkanAntrian(loket);

        };


    // ========================================
    // REQUEST
    // ========================================

    script =
        document.createElement("script");

    script.src =
        SCRIPT_URL +
        "?action=next" +
        "&loket=" +
        encodeURIComponent(loket) +
        "&callback=" +
        callbackName;

    script.onerror =
        function() {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;

            console.error(
                "Gagal menghubungi server:",
                loket
            );

            alert(
                "Gagal terhubung ke server. Silakan coba lagi."
            );

            bersihkanRequest();

            requestAktif[loket].next =
                false;

            btnPanggil.disabled =
                btnSelesai.disabled === false;

        };

    document.body.appendChild(script);

}


// ========================================
// DAFTAR MENUNGGU
// ========================================

function tampilkanAntrian(loket) {

    if (requestAktif[loket].queue) {
        return;
    }

    requestAktif[loket].queue = true;

    const callbackName =
        "queueCallback_" +
        loket +
        "_" +
        Date.now();

    let requestSelesai = false;

    let script;


    function bersihkanRequest() {

        delete window[callbackName];

        if (
            script &&
            script.parentNode
        ) {

            script.parentNode.removeChild(
                script
            );

        }

    }


    window[callbackName] =
        function(data) {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;

            console.log(
                "Daftar " + loket + ":",
                data
            );


            const container =
                document.getElementById(
                    "daftarMenunggu" + loket
                );


            if (
                !data ||
                !data.success ||
                !data.antrian ||
                data.antrian.length === 0
            ) {

                container.innerHTML = `
                    <h3>
                        DAFTAR MENUNGGU
                        <span class="jumlah-antrian">
                            · 0 ORANG
                        </span>
                    </h3>

                    <p class="antrian-kosong">
                        Belum ada antrean.
                    </p>
                `;

            } else {

                const jumlah =
                    data.antrian.length;

                let html = `
                    <h3>
                        DAFTAR MENUNGGU
                        <span class="jumlah-antrian">
                            · ${jumlah} ORANG
                        </span>
                    </h3>

                    <div class="list-antrian-scroll">
                `;


                data.antrian.forEach(
                    function(item) {

                        html += `
                            <div class="antrian-item">

                                <strong>
                                    ${item.nomor}
                                </strong>

                                <span>
                                    ${item.layanan}
                                </span>

                            </div>
                        `;

                    }
                );


                html += `
                    </div>
                `;


                container.innerHTML =
                    html;

            }


            bersihkanRequest();

            requestAktif[loket].queue =
                false;

        };


    script =
        document.createElement("script");


    script.src =
        SCRIPT_URL +
        "?action=queue" +
        "&loket=" +
        encodeURIComponent(loket) +
        "&callback=" +
        callbackName;


    script.onerror =
        function() {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;

            console.error(
                "Gagal mengambil daftar antrian:",
                loket
            );

            bersihkanRequest();

            requestAktif[loket].queue =
                false;

        };


    document.body.appendChild(script);

}


// ========================================
// CEK NOMOR SEKARANG
// ========================================

function cekNomorSekarang(loket) {

    if (requestAktif[loket].current) {
        return;
    }

    requestAktif[loket].current = true;

    const callbackName =
        "currentCallback_" +
        loket +
        "_" +
        Date.now();

    let requestSelesai = false;

    let script;

    const timeout =
        setTimeout(function() {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;

            console.error(
                "Request current timeout:",
                loket
            );

            bersihkanRequest();

            requestAktif[loket].current =
                false;

        }, 5000);


    function bersihkanRequest() {

        clearTimeout(timeout);

        delete window[callbackName];

        if (
            script &&
            script.parentNode
        ) {

            script.parentNode.removeChild(
                script
            );

        }

    }


    window[callbackName] =
        function(data) {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;

            console.log(
                "Current " + loket + ":",
                data
            );


            const nomorElement =
                document.querySelector(
                    "#nomorSekarang" + loket + " h1"
                );


            const btnPanggil =
                document.getElementById(
                    "btnPanggil" + loket
                );


            const btnSelesai =
                document.getElementById(
                    "btnSelesai" + loket
                );

            if (
                data &&
                data.success &&
                data.nomor
            ) {
                
                nomorElement.textContent =
                    data.nomor;
                
                tampilkanLayananLoket(
                    loket,
                    data.layanan
                );
                
                btnPanggil.disabled =
                    true;
                
                btnSelesai.disabled =
                    false;

            } else {

                nomorElement.textContent =
                    "-";
                
                tampilkanLayananLoket(
                    loket,
                    null
                );
                
                btnPanggil.disabled =
                    false;
                
                btnSelesai.disabled =
                    true;
            }


            bersihkanRequest();

            requestAktif[loket].current =
                false;

        };


    script =
        document.createElement("script");


    script.src =
        SCRIPT_URL +
        "?action=current" +
        "&loket=" +
        encodeURIComponent(loket) +
        "&callback=" +
        callbackName;


    script.onerror =
        function() {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;

            console.error(
                "Gagal mengecek nomor sekarang:",
                loket
            );

            bersihkanRequest();

            requestAktif[loket].current =
                false;

        };


    document.body.appendChild(script);

}


// ========================================
// SELESAIKAN
// ========================================

function selesaikanAntrian(loket) {

    if (requestAktif[loket].finish) {
        return;
    }


    const nomor =
        document.querySelector(
            "#nomorSekarang" + loket + " h1"
        ).textContent;


    if (
        !nomor ||
        nomor === "-"
    ) {

        alert(
            "Belum ada antrean yang sedang dilayani."
        );

        return;

    }


    requestAktif[loket].finish =
        true;


    const btnSelesai =
        document.getElementById(
            "btnSelesai" + loket
        );


    const btnPanggil =
        document.getElementById(
            "btnPanggil" + loket
        );


    btnSelesai.disabled = true;


    const callbackName =
        "finishCallback_" +
        loket +
        "_" +
        Date.now();


    let requestSelesai = false;

    let script;


    const timeout =
        setTimeout(function() {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;

            console.error(
                "Request finish timeout:",
                loket
            );

            alert(
                "Server tidak merespons. Antrean belum diubah. Silakan coba lagi."
            );

            bersihkanRequest();

            requestAktif[loket].finish =
                false;

            btnSelesai.disabled = false;

        }, 5000);


    function bersihkanRequest() {

        clearTimeout(timeout);

        delete window[callbackName];

        if (
            script &&
            script.parentNode
        ) {

            script.parentNode.removeChild(
                script
            );

        }

    }


    window[callbackName] =
        function(data) {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;

            console.log(
                "Selesai " + loket + ":",
                data
            );


            if (
                data &&
                data.success
            ) {

                document.querySelector(
                    "#nomorSekarang" + loket + " h1"
                ).textContent =
                    "-";
                
                tampilkanLayananLoket(
                    loket,
                    null
                );

                btnPanggil.disabled =
                    false;

                btnSelesai.disabled =
                    true;

                tampilkanAntrian(loket);

            } else {

                alert(
                    data && data.message
                        ? data.message
                        : "Gagal menyelesaikan antrean."
                );

                btnSelesai.disabled =
                    false;

            }


            bersihkanRequest();

            requestAktif[loket].finish =
                false;

        };


    // ========================================
    // REQUEST
    // ========================================

    script =
        document.createElement("script");


    script.src =
        SCRIPT_URL +
        "?action=finish" +
        "&loket=" +
        encodeURIComponent(loket) +
        "&nomor=" +
        encodeURIComponent(nomor) +
        "&callback=" +
        callbackName;


    script.onerror =
        function() {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;

            console.error(
                "Gagal menghubungi server:",
                loket
            );

            alert(
                "Gagal terhubung ke server. Antrean belum diubah. Silakan coba lagi."
            );

            bersihkanRequest();

            requestAktif[loket].finish =
                false;

            btnSelesai.disabled = false;

        };


    document.body.appendChild(script);

}


// ========================================
// SAAT HALAMAN DIBUKA
// ========================================

cekNomorSekarang("A");
cekNomorSekarang("B");
cekNomorSekarang("C");

tampilkanAntrian("A");
tampilkanAntrian("B");
tampilkanAntrian("C");


// ========================================
// UPDATE OTOMATIS SETIAP 2 DETIK
// ========================================

setInterval(function() {

    tampilkanAntrian("A");
    tampilkanAntrian("B");
    tampilkanAntrian("C");

}, 2000);


// ========================================
// TANGGAL DAN HARI
// ========================================

function tampilkanTanggal() {

    const sekarang =
        new Date();


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
        "tanggalHari"
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

tampilkanTanggal();

// ========================================
// REKAPITULASI & DOWNLOAD EXCEL
// ========================================

const periodeRekap =
    document.getElementById("periodeRekap");

const fieldTanggal =
    document.getElementById("fieldTanggal");

const fieldBulan =
    document.getElementById("fieldBulan");

const tanggalRekap =
    document.getElementById("tanggalRekap");

const bulanRekap =
    document.getElementById("bulanRekap");


// ========================================
// DEFAULT TANGGAL
// ========================================

function tanggalHariIni() {

    const sekarang = new Date();

    const tahun =
        sekarang.getFullYear();

    const bulan =
        String(
            sekarang.getMonth() + 1
        ).padStart(2, "0");

    const tanggal =
        String(
            sekarang.getDate()
        ).padStart(2, "0");

    return (
        tahun +
        "-" +
        bulan +
        "-" +
        tanggal
    );

}


// Isi tanggal hari ini
if (tanggalRekap) {

    tanggalRekap.value =
        tanggalHariIni();

}


// Isi bulan sekarang
if (bulanRekap) {

    const sekarang = new Date();

    const tahun =
        sekarang.getFullYear();

    const bulan =
        String(
            sekarang.getMonth() + 1
        ).padStart(2, "0");

    bulanRekap.value =
        tahun +
        "-" +
        bulan;

}


// ========================================
// GANTI INPUT BERDASARKAN PERIODE
// ========================================

if (periodeRekap) {

    periodeRekap.addEventListener(
        "change",
        function() {

            const periode =
                periodeRekap.value;


            if (periode === "bulanan") {

                fieldTanggal.style.display =
                    "none";

                fieldBulan.style.display =
                    "flex";

            } else {

                fieldTanggal.style.display =
                    "flex";

                fieldBulan.style.display =
                    "none";

            }

        }
    );

}


// ========================================
// FORMAT TANGGAL
// ========================================

function formatTanggalIndonesia(tanggal) {

    const bagian =
        tanggal.split("-");

    return (
        bagian[2] +
        "/" +
        bagian[1] +
        "/" +
        bagian[0]
    );

}


// ========================================
// DOWNLOAD REKAP EXCEL
// ========================================

function downloadRekapExcel() {

    const periode =
        periodeRekap.value;

    let tanggalMulai;
    let tanggalAkhir;


    // ====================================
    // HARIAN
    // ====================================

    if (periode === "harian") {

        if (!tanggalRekap.value) {

            alert(
                "Silakan pilih tanggal terlebih dahulu."
            );

            return;

        }

        tanggalMulai =
            tanggalRekap.value;

        tanggalAkhir =
            tanggalRekap.value;

    }


    // ====================================
    // MINGGUAN
    // ====================================

    else if (periode === "mingguan") {

        if (!tanggalRekap.value) {

            alert(
                "Silakan pilih tanggal terlebih dahulu."
            );

            return;

        }


        const tanggal =
            new Date(
                tanggalRekap.value +
                "T00:00:00"
            );


        const hari =
            tanggal.getDay();


        // Senin = awal minggu
        const selisih =
            hari === 0
                ? -6
                : 1 - hari;


        const awalMinggu =
            new Date(tanggal);

        awalMinggu.setDate(
            tanggal.getDate() +
            selisih
        );


        const akhirMinggu =
            new Date(awalMinggu);

        akhirMinggu.setDate(
            awalMinggu.getDate() +
            6
        );


        tanggalMulai =
            tanggalKeString(
                awalMinggu
            );

        tanggalAkhir =
            tanggalKeString(
                akhirMinggu
            );

    }


    // ====================================
    // BULANAN
    // ====================================

    else if (periode === "bulanan") {

        if (!bulanRekap.value) {

            alert(
                "Silakan pilih bulan terlebih dahulu."
            );

            return;

        }


        const bagian =
            bulanRekap.value.split("-");


        const tahun =
            parseInt(
                bagian[0]
            );

        const bulan =
            parseInt(
                bagian[1]
            );


        tanggalMulai =
            tahun +
            "-" +
            String(bulan).padStart(2, "0") +
            "-01";


        const tanggalTerakhir =
            new Date(
                tahun,
                bulan,
                0
            );


        tanggalAkhir =
            tanggalKeString(
                tanggalTerakhir
            );

    }


    // ====================================
    // REQUEST KE GOOGLE APPS SCRIPT
    // ====================================

    const callbackName =
        "rekapCallback_" +
        Date.now();


    const script =
        document.createElement("script");


    let requestSelesai = false;


    window[callbackName] =
        function(data) {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;


            if (
                data &&
                data.success
            ) {

                buatExcelRekap(
                    data,
                    periode
                );

            } else {

                alert(
                    data && data.message
                        ? data.message
                        : "Gagal mengambil data rekap."
                );

            }


            delete window[callbackName];


            if (script.parentNode) {

                script.parentNode.removeChild(
                    script
                );

            }

        };


    script.onerror =
        function() {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;


            alert(
                "Gagal terhubung ke server."
            );


            delete window[callbackName];


            if (script.parentNode) {

                script.parentNode.removeChild(
                    script
                );

            }

        };


    script.src =
        SCRIPT_URL +
        "?action=rekap" +
        "&periode=" +
        encodeURIComponent(periode) +
        "&tanggalMulai=" +
        encodeURIComponent(tanggalMulai) +
        "&tanggalAkhir=" +
        encodeURIComponent(tanggalAkhir) +
        "&callback=" +
        callbackName;


    document.body.appendChild(
        script
    );

}


// ========================================
// KONVERSI DATE KE YYYY-MM-DD
// ========================================

function tanggalKeString(tanggal) {

    const tahun =
        tanggal.getFullYear();

    const bulan =
        String(
            tanggal.getMonth() + 1
        ).padStart(2, "0");

    const hari =
        String(
            tanggal.getDate()
        ).padStart(2, "0");

    return (
        tahun +
        "-" +
        bulan +
        "-" +
        hari
    );

}


// ========================================
// BUAT FILE EXCEL
// ========================================

function buatExcelRekap(data, periode) {

    if (
        typeof XLSX === "undefined"
    ) {

        alert(
            "Library Excel belum tersedia."
        );

        return;

    }


    const rows = [];


    // ====================================
    // JUDUL
    // ====================================

    rows.push([
        "REKAPITULASI ANTRIAN"
    ]);

    rows.push([
        "Periode",
        namaPeriode(periode)
    ]);

    rows.push([
        "Tanggal",
        formatTanggalIndonesia(
            data.tanggalMulai
        ) +
        " - " +
        formatTanggalIndonesia(
            data.tanggalAkhir
        )
    ]);

    rows.push([]);


    // ====================================
    // TOTAL ANTREAN
    // ====================================

    rows.push([
        "TOTAL ANTREAN"
    ]);

    rows.push([
        "Total",
        data.totalAntrian
    ]);

    rows.push([]);


    // ====================================
    // TOTAL PER LOKET
    // ====================================

    rows.push([
        "TOTAL PER LOKET"
    ]);

    rows.push([
        "Loket",
        "Jumlah Antrean"
    ]);

    rows.push([
        "Loket A",
        data.totalLoket.A || 0
    ]);

    rows.push([
        "Loket B",
        data.totalLoket.B || 0
    ]);

    rows.push([
        "Loket C",
        data.totalLoket.C || 0
    ]);

    rows.push([]);


    // ====================================
    // TOTAL PER LAYANAN
    // ====================================

    rows.push([
        "TOTAL PER LAYANAN"
    ]);

    rows.push([
        "Layanan",
        "Jumlah Antrean"
    ]);


    const layanan =
        data.totalLayanan || {};


    Object.keys(layanan).forEach(
        function(nama) {

            rows.push([
                nama,
                layanan[nama]
            ]);

        }
    );


    // ====================================
    // BUAT WORKBOOK
    // ====================================

    const worksheet =
        XLSX.utils.aoa_to_sheet(
            rows
        );


    worksheet["!cols"] = [
        {
            wch: 35
        },
        {
            wch: 20
        }
    ];


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Rekap"
    );


    // ====================================
    // NAMA FILE
    // ====================================

    const namaFile =
        "Rekap_Antrian_" +
        namaPeriodeFile(periode) +
        "_" +
        data.tanggalMulai +
        "_" +
        data.tanggalAkhir +
        ".xlsx";


    XLSX.writeFile(
        workbook,
        namaFile
    );

}


// ========================================
// NAMA PERIODE
// ========================================

function namaPeriode(periode) {

    if (periode === "harian") {
        return "Harian";
    }

    if (periode === "mingguan") {
        return "Mingguan";
    }

    if (periode === "bulanan") {
        return "Bulanan";
    }

    return "Custom";

}


function namaPeriodeFile(periode) {

    if (periode === "harian") {
        return "Harian";
    }

    if (periode === "mingguan") {
        return "Mingguan";
    }

    if (periode === "bulanan") {
        return "Bulanan";
    }

    return "Custom";

}