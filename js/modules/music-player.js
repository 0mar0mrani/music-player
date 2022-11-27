export default function MusicPlayer() {
	const allSongs = [
		{	title: 'Lifelike',
			artist: 'Alexi Action',
			duration: '2:24',
			url: '/assets/audio/lifelike.mp3',
			cover: '/assets/image/lifelike.jpg',
			id: '1',
		},
		{	title: 'Mountain Path',
			artist: 'Magnetic',
			duration: '3:28',
			url: '/assets/audio/mountainpath.mp3',
			cover: '/assets/image/mountainpath.jpg',
			id: '2',
		},		
		{	title: 'Please Calm My Mind',
			artist: 'Lesfm',
			duration: '2:55',
			url: '/assets/audio/pleasecalmmymind.mp3',
			cover: '/assets/image/pleasecalmmymind.jpg',
			id: '3',
		},		
		{	title: 'Drop It',
			artist: 'Coma',
			duration: '1:42',
			url: '/assets/audio/dropit.mp3',
			cover: '/assets/image/dropit.jpg',
			id: '4',
		},
		{	title: 'Password Infinity',
			artist: 'Evgeny',
			duration: '2:25',
			url: '/assets/audio/passwordinfinity.mp3',
			cover: '/assets/image/passwordinfinity.jpg',
			id: '5',
		},
		{	title: 'The Beat of Nature',
			artist: 'Olexy',
			duration: '2:53',
			url: '/assets/audio/thebeatofnature.mp3',
			cover: '/assets/image/thebeatofnature.jpg',
			id: '6',
		},
	]

	let currentSong;
	let currentSongIndex;
	let currentPlaylist = allSongs;
	let isPlaying = false;
	const audio = new Audio();
	let timerID;
	
	const songsContainer = document.querySelector('.songs__container');
	let songButtons;
	const playButton = document.querySelector('.songs__play-button');
	const previousButton = document.querySelector('.songs__previous-button');
	const nextButton = document.querySelector('.songs__next-button');
	const volumeRange = document.querySelector('.songs__volume-range');
	const timelineRange = document.querySelector('.songs__timeline-range');
	const timeStampCurrentTime = document.querySelector('.songs__timestamp-current-time');
	const timeStampDuration = document.querySelector('.songs__timestamp-duration');
	const currentSongCoverImage = document.querySelector('.songs__current-song-cover img');
	const currentSongTitle = document.querySelector('.songs__current-song-title');
	const currentSongArtist = document.querySelector('.songs__current-song-artist');
	function addQuerySelector() {
		songButtons = document.querySelectorAll('.songs__song');
	}

	playButton.addEventListener('click', handlePlayButtonClick);
	previousButton.addEventListener('click', handlePreviousButtonClick);
	nextButton.addEventListener('click', handleNextButtonClick);
	volumeRange.addEventListener('input', handleVolumeRangeInput);
	timelineRange.addEventListener('input', handleTimelineRangeInput);

	function addEventListeners() {
		for (const songButton of songButtons) {
			songButton.addEventListener('click', handleSongButtonClick);
		}
	}

	function handleNextButtonClick() {
		increaseCurrentSongIndex();
		setCurrentSong();
		changeAudioSource();
		isPlaying = true;
		renderAudio();
		renderHTML();
	}

	function handlePreviousButtonClick() {
		decreaseCurrentSongIndex();
		setCurrentSong();
		changeAudioSource();
		isPlaying = true;
		renderAudio();
		renderHTML();
	}

	function handlePlayButtonClick() {
		toggleIsPlaying();
		renderAudio();
		renderHTML();
	}

	function handleVolumeRangeInput() {
		setVolume()
	}

	function setVolume() {
		const rangeInput = volumeRange.value;
		audio.volume = rangeInput / 100;
	}

	function increaseCurrentSongIndex() {
		if (currentSongIndex < allSongs.length - 1) {
			currentSongIndex += 1;
		} else {
			currentSongIndex = 0;
		}
	}

	function decreaseCurrentSongIndex() {
		if (currentSongIndex !== 0) {
			currentSongIndex -= 1;
		} else {
			currentSongIndex = 0;
		}
	}

	function setCurrentSong() {
		currentSong = allSongs[currentSongIndex];
	}

	function toggleIsPlaying() {
		isPlaying = !isPlaying;
	}

	function renderAudio() {
		if (isPlaying) {
			audio.play();
		} else {
			audio.pause();
		}
	}

	function returnCheckIfSongFinished() {
		const duration = audio.duration;
		const currentTime = audio.currentTime

		if (duration / currentTime === 1) {
			return true;
		} else {
			return false;
		}
	}

	function goToNextSongIfFinished() {
		const isCurrentSongFinished = returnCheckIfSongFinished();
		
		if (isCurrentSongFinished) {
			increaseCurrentSongIndex();
			setCurrentSong();
			changeAudioSource();
			isPlaying = true;
			renderAudio();
			renderHTML();
		}
	}

	function getPropertiesOfClickedSong(event) {
		const clickedSong = event.currentTarget.dataset.id;

		for (let index = 0; index < allSongs.length; index += 1) {
			if (allSongs[index].id === clickedSong) {
				return [allSongs[index], index];
			}
		}
	}

	function changeAudioSource() {
		audio.src = currentSong.url;
	}
	
	function renderHTML() {
		renderSongs();
		renderCurrentSong();
	}

	function renderTimeline() {
		const duration = audio.duration;
		const currentTime = audio.currentTime;
		const currentTimeInPercent =  currentTime / duration * 100;

		timelineRange.value = currentTimeInPercent;


		const durationInMinutes = Math.floor(Math.floor(duration) / 60);
		const durationInSeconds = Math.floor(duration) - durationInMinutes * 60;

		if (isNaN(durationInMinutes) === false) {
			timeStampDuration.innerHTML = `${durationInMinutes}:${durationInSeconds}`
		}

		const currentTimeInMinutes = Math.floor(Math.floor(currentTime) / 60)
		const currentTimeInSeconds = Math.floor(currentTime) - currentTimeInMinutes * 60;

		if (isNaN(durationInMinutes) === false) {
			timeStampCurrentTime.innerHTML = `${currentTimeInMinutes}:${currentTimeInSeconds}`
		}
	}

	function renderCurrentSong() {
		currentSongCoverImage.src = currentSong.cover;
		currentSongTitle.innerText = currentSong.title;
		currentSongArtist.innerText = currentSong.artist;
	}

	function renderSongs() {
		songsContainer.innerHTML = ''

		for (let index = 0; index < allSongs.length; index += 1) {
			const song = document.createElement('button');
			song.className = 'songs__song';
			song.dataset.id = `${allSongs[index].id}`;

			const songNumber = document.createElement('p');
			songNumber.className = 'songs__song-number';
			songNumber.innerHTML = `${index + 1}`;
			song.append(songNumber);

			const songCover = document.createElement('div')
			songCover.className = 'songs__song-cover'
			const songCoverImage = document.createElement('img')
			songCoverImage.src = `${allSongs[index].cover}`
			songCover.append(songCoverImage);
			song.append(songCover);

			const songTitle = document.createElement('p');
			songTitle.className = 'songs__song-title';
			songTitle.innerHTML = `${allSongs[index].title}`;
			song.append(songTitle);
			
			const songArtist = document.createElement('p');
			songArtist.className = 'songs__song-artist';
			songArtist.innerHTML = `${allSongs[index].artist}`;
			song.append(songArtist);

			const songDuration = document.createElement('p');
			songDuration.className = 'songs__song-duration';
			songDuration.innerHTML = `${allSongs[index].duration}`;
			song.append(songDuration);

			songsContainer.append(song);

			addQuerySelector();
			addEventListeners();
		}
	}

	setInterval(goToNextSongIfFinished, 1000)
	renderHTML();
}

