/*
Design By : Abdi Syahputra Harahap
Website : www.maskoding.com
whatsappp : 0838 1174 6714

Pesan : Jika kamu butuh script node js lainnya, silahkan hubungi saya. Enjoy codinger....hehe...
*/


//---- Setting target sitemap
Link_Sitemap = 'https://acepxcode.blogspot.com/sitemap.xml';
Remove_Duplicate_Link = "yes";
//---------------------------

var unirest = require('unirest');
var random_useragent = require('random-useragent');
var fs = require('fs');
var DataRegex = new Array();
var dataNewSitemap = new Array();
var startLinkSitemap = 0;
var newDataUrlSitemap = "";

//Fungsi Extract Hostname From String
function extractHostname(t) {
    return (t.indexOf("//") > -1 ? t.split("/")[2] : t.split("/")[0]).split(":")[0].split("?")[0]
};

//Fungsi Menghapus String Array Kosong
// Referensi : https://www.maskoding.com/2020/08/menghapus-string-array-kosong.html
function cleanArray(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
};

// start ---------
unirest('GET', Link_Sitemap)
    .headers({
        'user-agent': random_useragent.getRandom()
    })
    .end(function (res) {
        // Mengekstrak Link Sitemap
        let getRegex = res.raw_body.match(/<loc>.*?(<\/loc>)/g);
        for (var i = 0; i < getRegex.length; i++) {
            DataRegex[i] = getRegex[i].replace(/(<loc>|<\/loc>)/g, "").replace(/(<\!\[CDATA\[|\]\]\>)/g, "");
            if (getRegex[i].indexOf(".xml") >= 0) {
                dataNewSitemap[i] = DataRegex[i];
            };
        };
        //Mendeteksi Apakah masih ada link sitemap
        if (dataNewSitemap.length == 0) {
            console.log("Tidak Ditemukan Link Sitemap di dalam url " + Link_Sitemap);
            setTimeout(function () {
                console.log("Mengekstrak Link di dalam url " + Link_Sitemap + " >>");
            }, 1000);
            setTimeout(function () {
                console.log(DataRegex.join("\n"));
                for (var i = 0; i < DataRegex.length; i++) {
                    newDataUrlSitemap += DataRegex[i] + ",";

                };
                saveFile();
            }, 4000);
        } else {
            console.log("Ditemukan " + dataNewSitemap.length + " Link Sitemap");
            setTimeout(function () {
                console.log("Mengekstrak Sub-Link Sitemap....")
            }, 1000);
            setTimeout(function () {
                nextExtracSubSitemap();
            }, 2000);
        };

    });

function nextExtracSubSitemap() {
    console.log("Mengekstrak link sitemap > " + dataNewSitemap[startLinkSitemap] + " ( " + Number(startLinkSitemap + 1) + "/" + dataNewSitemap.length + " )");
    unirest('GET', dataNewSitemap[startLinkSitemap])
        .headers({
            'user-agent': random_useragent.getRandom()
        })
        .end(function (res) {
            // Mengekstrak Sub-Link Sitemap
            if (startLinkSitemap < dataNewSitemap.length - 1) {
                let getRegex1 = res.raw_body.match(/<loc>.*?(<\/loc>)/g);
                for (var i = 0; i < getRegex1.length; i++) {
                    newDataUrlSitemap += getRegex1[i].replace(/(<loc>|<\/loc>)/g, "").replace(/(<\!\[CDATA\[|\]\]\>)/g, "") + ",";

                };
                console.log("Succes Mengekstrak " + cleanArray(newDataUrlSitemap.split(",")).length + " Link");
                startLinkSitemap += 1;
                nextExtracSubSitemap()
            } else if (startLinkSitemap == dataNewSitemap.length - 1) {
                console.log("Menampilkan Hasil Extract Url Sitemap..");
                setTimeout(function () {
                    if (Remove_Duplicate_Link == "yes") {
                        console.log(Array.from(new Set(newDataUrlSitemap.split(","))).toString().split(",").join("\n"));
                    } else {
                        console.log(cleanArray(newDataUrlSitemap.split(",")).join("\n"));
                    }
                    setTimeout(function () {
                        saveFile();
                    }, 1000);
                }, 2000);
            }
        });
}

function saveFile() {
    console.log("Membuat File Dengan Nama : " + extractHostname(Link_Sitemap) + ".txt");
    if (Remove_Duplicate_Link == "yes") {
        var DbFile = Array.from(new Set(cleanArray(newDataUrlSitemap.split(",")))).toString().split(",").join("\n");
        console.log("Membersihkan Link Duplicate / Link yang sama >_");
    } else {
        var DbFile = cleanArray(newDataUrlSitemap.split(",")).join("\n");
    };
    setTimeout(function () {
        console.log("Menyimpan File >_")
        var stream = fs.createWriteStream("OUTPUT/" + extractHostname(Link_Sitemap) + ".txt");
        stream.once('open', function (fd) {
            stream.write(DbFile);
            setTimeout(function () {
                console.log("suscces..");
            }, 1000);
            stream.end();
        });
    }, 1000);
};
