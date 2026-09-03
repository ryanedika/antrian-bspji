const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwDYTi20nqexFTYIwVDpOJufkoq8iiuDtQNGyVcYzv1E07yT2OzSJTZxURS77zXEims7w/exec";


let sedangMengambil = false;


// ========================================
// LOAD DAFTAR LAYANAN
// ========================================

function muatLayanan() {

    const container =
        document.getElementById("daftarLayanan");

    if (!container) {
        return;
    }


    const callbackName =
        "callbackLayanan_" + Date.now();


    let requestSelesai = false;


    const script =
        document.createElement("script");


    function bersihkanRequest() {

        delete window[callbackName];

        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }

        clearTimeout(timeout);

    }


    // ========================================
    // CALLBACK
    // ========================================

    window[callbackName] =
        function(data) {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;


            console.log(
                "Daftar layanan:",
                data
            );


            if (
                data &&
                data.success &&
                Array.isArray(data.layanan)
            ) {

                tampilkanLayanan(
                    data.layanan
                );

            } else {

                container.innerHTML =
                    "<p>Gagal memuat layanan.</p>";

            }


            bersihkanRequest();

        };


    // ========================================
    // REQUEST
    // ========================================

    script.src =
        SCRIPT_URL +
        "?action=layanan" +
        "&callback=" +
        callbackName;


    // ========================================
    // TIMEOUT
    // ========================================

    const timeout =
        setTimeout(function() {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;


            console.error(
                "Request layanan timeout."
            );


            container.innerHTML =
                "<p>Gagal memuat layanan. Silakan muat ulang halaman.</p>";


            bersihkanRequest();

        }, 10000);


    // ========================================
    // ERROR
    // ========================================

    script.onerror =
        function() {

            if (requestSelesai) {
                return;
            }

            requestSelesai = true;


            console.error(
                "Gagal mengambil daftar layanan."
            );


            container.innerHTML =
                "<p>Gagal memuat layanan. Silakan muat ulang halaman.</p>";


            bersihkanRequest();

        };


    document.body.appendChild(
        script
    );

}


// ========================================
// TAMPILKAN DAFTAR LAYANAN
// ========================================

function tampilkanLayanan(daftar) {

    const container =
        document.getElementById("daftarLayanan");


    container.innerHTML = "";


    if (!daftar || daftar.length === 0) {

        container.innerHTML =
            "<p>Tidak ada layanan yang tersedia.</p>";

        return;
    }


    daftar.forEach(function(layanan) {

        const card = document.createElement("div");
        card.className = "layanan-card loket-" + layanan.loket.toLowerCase();

        const button =
            document.createElement("button");

        button.type =
            "button";


        button.innerHTML = `
            <span>${layanan.nama}</span>
            <span class="arrow">›</span>
        `;

        button.classList.add("loket-" + layanan.loket.toLowerCase());

        button.onclick =
            function() {

                ambilNomor(
                    layanan.kode,
                    layanan.nama
                );

            };


        const description =
            document.createElement("p");

        description.textContent =
            layanan.deskripsi;


        card.appendChild(
            button
        );

        card.appendChild(
            description
        );


        container.appendChild(
            card
        );

    });

}


// ========================================
// AMBIL NOMOR
// ========================================

function ambilNomor(kode, layanan) {

    // Kalau sedang mengambil nomor,
    // jangan izinkan klik lagi

    if (sedangMengambil) {
        return;
    }


    sedangMengambil = true;


    console.log(
        "Tombol diklik:",
        kode,
        layanan
    );


    // ========================================
    // NONAKTIFKAN SEMUA TOMBOL LAYANAN
    // ========================================

    const semuaTombol =
        document.querySelectorAll(
            "#daftarLayanan button"
        );


    semuaTombol.forEach(function(tombol) {

        tombol.disabled = true;

    });


    // Ubah teks tombol yang dipilih

    const tombolDipilih =
        Array.from(semuaTombol).find(
            function(tombol) {
                return tombol.textContent === layanan;
            }
        );


    if (tombolDipilih) {

        tombolDipilih.textContent =
            "MENGAMBIL NOMOR...";

    }


    // ========================================
    // CALLBACK
    // ========================================

    const callbackName =
        "callback_" + Date.now();


    let requestSelesai = false;


    // ========================================
    // FUNGSI MEMBERSIHKAN REQUEST
    // ========================================

    function bersihkanRequest() {

        delete window[callbackName];

        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }

        clearTimeout(timeout);

    }


    // ========================================
    // CALLBACK DARI APPS SCRIPT
    // ========================================

    window[callbackName] =
        function(data) {

            if (requestSelesai) {
                return;
            }


            requestSelesai = true;


            console.log(
                "Data diterima:",
                data
            );


            if (
                data &&
                data.success &&
                data.nomor
            ) {

                // ========================================
                // MASUKKAN DATA KE POPUP
                // ========================================

                document.getElementById(
                    "nomorPopup"
                ).textContent =
                    data.nomor;


                document.getElementById(
                    "layananPopup"
                ).textContent =
                    data.layanan;


                // ========================================
                // TAMPILKAN POPUP
                // ========================================

                document.getElementById(
                    "popupAntrian"
                ).classList.add("aktif");


            } else {

                alert(
                    data && data.message
                        ? data.message
                        : "Gagal mengambil nomor antrian."
                );


                muatLayanan();

                sedangMengambil = false;

            }


            bersihkanRequest();

        };


    // ========================================
    // REQUEST KE APPS SCRIPT
    // ========================================

    const script =
        document.createElement("script");


    script.src =
        SCRIPT_URL +
        "?layanan=" +
        encodeURIComponent(kode) +
        "&callback=" +
        callbackName;


    // ========================================
    // TIMEOUT
    // ========================================

    const timeout =
        setTimeout(function() {

            if (requestSelesai) {
                return;
            }


            requestSelesai = true;


            console.error(
                "Request timeout."
            );


            alert(
                "Server tidak merespons. Silakan coba lagi."
            );


            bersihkanRequest();


            muatLayanan();

            sedangMengambil = false;


        }, 10000);


    // ========================================
    // KALAU REQUEST GAGAL
    // ========================================

    script.onerror =
        function() {

            if (requestSelesai) {
                return;
            }


            requestSelesai = true;


            console.error(
                "Gagal menghubungi Apps Script."
            );


            alert(
                "Gagal terhubung ke server. Silakan coba lagi."
            );


            bersihkanRequest();


            muatLayanan();

            sedangMengambil = false;

        };


    document.body.appendChild(
        script
    );

}


// ========================================
// TUTUP POPUP
// ========================================

function tutupPopup() {

    document.getElementById(
        "popupAntrian"
    ).classList.remove("aktif");


    // Kembalikan daftar layanan
    // ke kondisi normal

    muatLayanan();

    sedangMengambil = false;

}


// ========================================
// UNDUH NOMOR SEBAGAI PNG
// ========================================

function unduhNomor() {

    const nomor =
        document.getElementById(
            "nomorPopup"
        ).textContent;

    const layanan =
        document.getElementById(
            "layananPopup"
        ).textContent;


    // ========================================
    // LOAD LOGO
    // ========================================

    const logo =
        new Image();

    logo.src =
        "logo-bspji-pdg.png";


    logo.onload =
        function() {

            buatKartuAntrian(
                nomor,
                layanan,
                logo
            );

        };


    logo.onerror =
        function() {

            // Kalau logo gagal dimuat,
            // tetap buat kartu tanpa logo

            buatKartuAntrian(
                nomor,
                layanan,
                null
            );

        };

}


// ========================================
// BUAT KARTU ANTRIAN
// ========================================

function buatKartuAntrian(
    nomor,
    layanan,
    logo
) {

    // ========================================
    // BUAT CANVAS
    // ========================================

    const canvas =
        document.createElement("canvas");

    const ctx =
        canvas.getContext("2d");

    canvas.width = 1080;
    canvas.height = 1350;


    // ========================================
    // BACKGROUND
    // ========================================

    ctx.fillStyle =
        "#f7f9f8";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ========================================
    // KARTU UTAMA
    // ========================================

    const cardX = 70;
    const cardY = 60;
    const cardWidth = 940;
    const cardHeight = 1230;

    ctx.fillStyle =
        "#ffffff";

    ctx.beginPath();

    ctx.roundRect(
        cardX,
        cardY,
        cardWidth,
        cardHeight,
        35
    );

    ctx.fill();


    // ========================================
    // LOGO
    // ========================================

    if (logo) {

        const logoWidth = 300;

        const logoHeight =
            logo.height *
            (logoWidth / logo.width);

        ctx.drawImage(
            logo,
            540 - (logoWidth / 2),
            105,
            logoWidth,
            logoHeight
        );

    }


    // ========================================
    // HEADER
    // ========================================

    ctx.textAlign =
        "center";

    ctx.fillStyle =
        "#12345b";

    ctx.font =
        "bold 34px Arial";

    ctx.fillText(
        "UNIT PELAYANAN PUBLIK",
        540,
        300
    );


    ctx.font =
        "bold 28px Arial";

    ctx.fillText(
        "BSPJI PADANG",
        540,
        345
    );


    // ========================================
    // GARIS PEMISAH
    // ========================================

    ctx.strokeStyle =
        "#dfe3e6";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(
        180,
        395
    );

    ctx.lineTo(
        900,
        395
    );

    ctx.stroke();


    // ========================================
    // JUDUL
    // ========================================

    ctx.fillStyle =
        "#777";

    ctx.font =
        "bold 26px Arial";

    ctx.fillText(
        "NOMOR ANTRIAN ANDA",
        540,
        475
    );


    // ========================================
    // BADGE NOMOR
    // ========================================

    const badgeX = 150;
    const badgeY = 525;
    const badgeWidth = 780;
    const badgeHeight = 300;

    ctx.fillStyle =
        "#f1f5f8";

    ctx.beginPath();

    ctx.roundRect(
        badgeX,
        badgeY,
        badgeWidth,
        badgeHeight,
        30
    );

    ctx.fill();


    // ========================================
    // NOMOR
    // ========================================

    ctx.fillStyle =
        "#12345b";

    ctx.font =
        "bold 150px Arial";

    ctx.fillText(
        nomor,
        540,
        715
    );


    // ========================================
    // LAYANAN
    // ========================================

    ctx.fillStyle =
        "#555";

    ctx.font =
        "bold 32px Arial";

    ctx.fillText(
        layanan,
        540,
        900
    );


    // ========================================
    // PESAN
    // ========================================

    ctx.fillStyle =
        "#777";

    ctx.font =
        "24px Arial";

    ctx.fillText(
        "Simpan nomor antrian Anda",
        540,
        970
    );

    ctx.fillText(
        "untuk memantau giliran.",
        540,
        1010
    );


    // ========================================
    // FOOTER
    // ========================================

    ctx.strokeStyle =
        "#e3e6e8";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        230,
        1070
    );

    ctx.lineTo(
        850,
        1070
    );

    ctx.stroke();


    ctx.fillStyle =
        "#12345b";

    ctx.font =
        "bold 25px Arial";

    ctx.fillText(
        "BSPJI PADANG",
        540,
        1140
    );


    ctx.fillStyle =
        "#999";

    ctx.font =
        "21px Arial";

    ctx.fillText(
        "Unit Pelayanan Publik",
        540,
        1180
    );


    // ========================================
    // DOWNLOAD PNG
    // ========================================

    canvas.toBlob(
        function(blob) {

            if (!blob) {

                alert(
                    "Gagal membuat file nomor antrian."
                );

                return;
            }


            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href =
                url;

            link.download =
                "Nomor-Antrian-" +
                nomor +
                ".png";

            document.body.appendChild(
                link
            );

            link.click();

            document.body.removeChild(
                link
            );


            // Beri sedikit waktu sebelum
            // menghapus object URL
            setTimeout(function() {

                URL.revokeObjectURL(
                    url
                );

            }, 1000);

        },
        "image/png"
    );

}

// ========================================
// MUAT LAYANAN SAAT HALAMAN DIBUKA
// ========================================
muatLayanan();