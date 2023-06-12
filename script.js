window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechRecognition = new SpeechRecognition();
speechRecognition.interimResults = true;
speechRecognition.lang = 'en-US';

let p = document.createElement('p');
const micButton = document.querySelector('.mic');
const textArea = document.querySelector('.text_canvas');
const iconsContainer = document.querySelector('.icons');
const iconsMap = {};

textArea.append(p);

speechRecognition.addEventListener('result', (e) => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

    p.textContent = transcript;

    if (e.results[0].isFinal) {
        p = document.createElement('p');
        textArea.appendChild(p);
    }

    const lowered = transcript.split('').map((char) => char.toLowerCase()).join('');
    handleShowIcon(lowered);
    if (lowered.includes('stop recording')) {
        speechRecognition.stop();
        transcript.replace('stop recording', '')
        micButton.classList.remove('recording');
        micButton.classList.add('paused');
    }
    if (lowered.includes('clear all')) {
        transcript.replace('clear all', '');
        textArea.innerHTML = '';
    }
})

speechRecognition.addEventListener('end', () => {
    if (micButton.classList.contains('recording')) {
        speechRecognition.start();
    }

});

const startRecording = () => {
    if (micButton.classList.contains('recording')) {
        micButton.classList.remove('recording');
        micButton.classList.add('paused');
        speechRecognition.stop();
    } else {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                // Microphone access granted
                console.log('Microphone access granted');
                speechRecognition.start();
                micButton.classList.remove('paused');
                micButton.classList.add('recording');

            })
            .catch(function (err) {
                // Microphone access denied or error occurred
                alert('Please Grant Microphone Access');
                console.log(err);
            });
    }


}

const showIcons = (icons) => {
    const iconsSpan = document.createElement('div');
    iconsSpan.classList.add('icon');
    iconsSpan.style.left = `${10 + Math.floor(Math.random() * 80)}%`;
    iconsSpan.textContent = icons;
    iconsContainer.appendChild(iconsSpan);
    setTimeout(() => {
        iconsSpan.classList.add('show');
    }, 100)
}

const handleShowIcon = (lowered) => {
    if (lowered.includes('love') && (!iconsMap['love'] || iconsMap['love'] < 3)) {
        showIcons('💖');
        iconsMap['love']++;
    }
    if (lowered.includes('cat') && (!iconsMap['cat'] || iconsMap['cat'] < 3)) {
        showIcons('😼');
        iconsMap['cat']++;
    }
    if (lowered.includes('unicorn') && (!iconsMap['unicorn'] || iconsMap['unicorn'] < 3)) {
        showIcons('🦄');
        iconsMap['unicorn']++;
    }
    if (lowered.includes('dog') && (!iconsMap['dog'] || iconsMap['dog'] < 3)) {
        showIcons('🐶');
        iconsMap['dog']++;
    }

}
