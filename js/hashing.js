//an hash table for a few of categories described in Kodcu.com
var hashtable = function () {

    var url = new Object();
    url["yazılım"] = "yazilim";
    url["yazılar"] = "yazilar";
    url["kitap"] = "kitap-2";
    url["agile"] = "agile-2";
    url["java"] = "yazilar/java";
    url["kanban"] = "kanban";
    url["eğitim"] = "egitim-2";
    url["egitim"] = "egitim-2";
    url["big data"] = "big-data";
    url["html 5"] = "html-5";
    url["javascript & ajax"] = "yazilar/javascript-ajax";
    url["sql"] = "sql-2";
    url["veritabanlari"] = "yazilar/veritabanlari";
    url["webinar"] = "webinar";
    url["python"] = "yazilar/python";
    url["java güvenlik çatıları"] = "java-guvenlik-catilari";
    url["apache shiro"] = "java-guvenlik-catilari/apache-shiro-java-guvenlik-catilari";
    url["güvenlik"] = "guvenlik-2";
    url["html & css"] = "yazilar/html-css";
    url["nosql"] = "nosql-2";
    url["mangodb"] = "nosql-2/mangodb-2";
    url["mobil"] = "mobil-2";
    url["verimlilik"] = "verimlilik";
    url["javaee 7"] = "java-ee-7-2";
    url["tutorial"] = "tutorial-2";
    url["game"] = "game";
    url["mobil"] = "mobil-2";
    url["ios"] = "yazilar/ios-yazilar";
    url["grails"] = "grails";
    url["javaee"] = "javaee-2";
    url[".net"] = "yazilar/dotnet";
    url["spring çatısı"] = "spring-catisi";
    url["sunucu"] = "sunucu";
    url["girisimcilik"] = "girisimcilik";
    url["girişimcilik"] = "girisimcilik";
    url["web intelligence"] = "web-intelligence";
    url["yapay zeka"] = "yapay-zeka";
    url["java enterprise edition"] = "java-enterprise-edition";
    url["startup"] = "startup";
    url["android"] = "yazilar/android-yazilar";
    url["javaserver faces"] = "javaserver-faces";
    url["is zekasi"] = "yazilar/is-zekasi";
    url["iş zekasi"] = "yazilar/is-zekasi";
    url["php"] = "yazilar/php";
    url["jpa"] = "jpa-2";
    url["pano"] = "pano-2";

    this.getValue = function (key) {
        return url[key];// can return undefined!
    }

}