var langs = [
    ['Afrikaans', ['af-ZA']],
    ['አማርኛ', ['am-ET']],
    ['Azərbaycanca', ['az-AZ']],
    ['বাংলা', ['bn-BD', 'বাংলাদেশ'],
        ['bn-IN', 'ভারত']
    ],
    ['Bahasa Indonesia', ['id-ID']],
    ['Bahasa Melayu', ['ms-MY']],
    ['Català', ['ca-ES']],
    ['Čeština', ['cs-CZ']],
    ['Dansk', ['da-DK']],
    ['Deutsch', ['de-DE']],
    ['English', ['en-AU', 'Australia'],
        ['en-CA', 'Canada'],
        ['en-IN', 'India'],
        ['en-KE', 'Kenya'],
        ['en-TZ', 'Tanzania'],
        ['en-GH', 'Ghana'],
        ['en-NZ', 'New Zealand'],
        ['en-NG', 'Nigeria'],
        ['en-ZA', 'South Africa'],
        ['en-PH', 'Philippines'],
        ['en-GB', 'United Kingdom'],
        ['en-US', 'United States']
    ],
    ['Español', ['es-AR', 'Argentina'],
        ['es-BO', 'Bolivia'],
        ['es-CL', 'Chile'],
        ['es-CO', 'Colombia'],
        ['es-CR', 'Costa Rica'],
        ['es-EC', 'Ecuador'],
        ['es-SV', 'El Salvador'],
        ['es-ES', 'España'],
        ['es-US', 'Estados Unidos'],
        ['es-GT', 'Guatemala'],
        ['es-HN', 'Honduras'],
        ['es-MX', 'México'],
        ['es-NI', 'Nicaragua'],
        ['es-PA', 'Panamá'],
        ['es-PY', 'Paraguay'],
        ['es-PE', 'Perú'],
        ['es-PR', 'Puerto Rico'],
        ['es-DO', 'República Dominicana'],
        ['es-UY', 'Uruguay'],
        ['es-VE', 'Venezuela']
    ],
    ['Euskara', ['eu-ES']],
    ['Filipino', ['fil-PH']],
    ['Français', ['fr-FR']],
    ['Basa Jawa', ['jv-ID']],
    ['Galego', ['gl-ES']],
    ['ગુજરાતી', ['gu-IN']],
    ['Hrvatski', ['hr-HR']],
    ['IsiZulu', ['zu-ZA']],
    ['Íslenska', ['is-IS']],
    ['Italiano', ['it-IT', 'Italia'],
        ['it-CH', 'Svizzera']
    ],
    ['ಕನ್ನಡ', ['kn-IN']],
    ['ភាសាខ្មែរ', ['km-KH']],
    ['Latviešu', ['lv-LV']],
    ['Lietuvių', ['lt-LT']],
    ['മലയാളം', ['ml-IN']],
    ['मराठी', ['mr-IN']],
    ['Magyar', ['hu-HU']],
    ['ລາວ', ['lo-LA']],
    ['Nederlands', ['nl-NL']],
    ['नेपाली भाषा', ['ne-NP']],
    ['Norsk bokmål', ['nb-NO']],
    ['Polski', ['pl-PL']],
    ['Português', ['pt-BR', 'Brasil'],
        ['pt-PT', 'Portugal']
    ],
    ['Română', ['ro-RO']],
    ['සිංහල', ['si-LK']],
    ['Slovenščina', ['sl-SI']],
    ['Basa Sunda', ['su-ID']],
    ['Slovenčina', ['sk-SK']],
    ['Suomi', ['fi-FI']],
    ['Svenska', ['sv-SE']],
    ['Kiswahili', ['sw-TZ', 'Tanzania'],
        ['sw-KE', 'Kenya']
    ],
    ['ქართული', ['ka-GE']],
    ['Հայերեն', ['hy-AM']],
    ['தமிழ்', ['ta-IN', 'இந்தியா'],
        ['ta-SG', 'சிங்கப்பூர்'],
        ['ta-LK', 'இலங்கை'],
        ['ta-MY', 'மலேசியா']
    ],
    ['తెలుగు', ['te-IN']],
    ['Tiếng Việt', ['vi-VN']],
    ['Türkçe', ['tr-TR']],
    ['اُردُو', ['ur-PK', 'پاکستان'],
        ['ur-IN', 'بھارت']
    ],
    ['Ελληνικά', ['el-GR']],
    ['български', ['bg-BG']],
    ['Pусский', ['ru-RU']],
    ['Српски', ['sr-RS']],
    ['Українська', ['uk-UA']],
    ['한국어', ['ko-KR']],
    ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
        ['cmn-Hans-HK', '普通话 (香港)'],
        ['cmn-Hant-TW', '中文 (台灣)'],
        ['yue-Hant-HK', '粵語 (香港)']
    ],
    ['日本語', ['ja-JP']],
    ['हिन्दी', ['hi-IN']],
    ['ภาษาไทย', ['th-TH']]
];
var talktres = 0;
var normtres = 0;
var final_transcript = '';
var recognizing = false;
var freeze = false;
window.onload = function () {
    var soundAllowed = function (stream) {
        document.getElementById('h').innerHTML = "SPEAK";

        window.persistAudioStream = stream;
        var audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource(stream);
        var analyser = audioContent.createAnalyser();
        audioStream.connect(analyser);
        analyser.fftSize = 1024;

        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);

        var doDraw = function () {
            requestAnimationFrame(doDraw);
            analyser.getByteFrequencyData(frequencyArray);
            power = frequencyArray[0];
            if (!freeze)
                if (power > talktres) {
                    talktres = power;
                    $('#h').css('opacity',1);
                    startRecog();
                } else {
                    if (talktres > 0.0)
                        talktres -= 0.5; //talktres*0.01;
                    if ($('#h').css('opacity') > 0.0)
                        $('#h').css('opacity',$('#h').css('opacity')-0.008);
                    else
                        $('#h').html('');
                }
            resizeText(10 + talktres);
            // for (var i = 0; i < 255; i += 5) {
            //     power = 2 * frequencyArray[i];
            //     resizeText(10+power);
            //     startRecog()
            // }
        }
        doDraw();
    }

    var soundNotAllowed = function (error) {
        $('#h').html("You must allow your microphone.");
        console.log(error);
    }

    navigator.getUserMedia({
        audio: true
    }, soundAllowed, soundNotAllowed);

    function resizeText(multiplier) {
        $('#h').css('font-size', parseFloat(multiplier) + "px");
    }

    for (var i = 0; i < langs.length; i++) {
        select_language.options[i] = new Option(langs[i][0], i);
    }
    
    select_language.selectedIndex = 10;
    updateCountry();
    select_dialect.selectedIndex = 11;

};
function updateCountry() {
    for (var i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
    }
    var list = langs[select_language.selectedIndex];
    for (var i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
    select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
    updateLang();
}

function updateLang() {
    console.log('Change to : '+select_dialect.value);
    recognition.lang = select_dialect.value;
    recognition.stop();
}


function freezeBtn(event) {

    if (recognizing) {
        freeze = true;
        recognition.stop();
        return;
    } else {
        freeze = false;
        startRecog();
    }

}

function clearBtn(event) {
    final_transcript = '';
    $('#h').html('SPEAK');
    
}

function startRecog() {
    if (recognizing)
        return;
    recognition.lang = select_dialect.value;
    recognition.start();
    final_transcript = '';
    $('#h').html('SPEAK');

    console.log(recognition.lang);
}

if (!('webkitSpeechRecognition' in window)) {
    alert('Your browser is not supported..');
} else {


    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    startRecog();

    recognition.onstart = function () {
        console.log('listening..');
        recognizing = true;
    };

    recognition.onend = function () {
        console.log('end..');
        recognizing = false;

        // if (!final_transcript) {
        //     return;
        // }

    };
    recognition.onresult = function (event) {
        console.log('result..');
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }

        if (interim_transcript != '')
            $('#h').html(capitalize(interim_transcript));


    };
}

function capitalize(s) {
    return s.replace(/\S/, function (m) {
        return m.toUpperCase();
    });
}

