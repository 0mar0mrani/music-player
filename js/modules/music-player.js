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
		{	title: 'Powerfull',
			artist: 'Penguin',
			duration: '1:13',
			url: '/assets/audio/powerful.mp3',
			cover: '/assets/image/powerful.jpg',
			id: '7',
		},
		{	title: 'The Blackest Bouquet',
			artist: 'LeonellCassio',
			duration: '3:41',
			url: '/assets/audio/theblackestbouquet.mp3',
			cover: '/assets/image/theblackestbouquet.jpg',
			id: '8',
		},
		{	title: 'Weeknds',
			artist: 'Dayfox',
			duration: '3:28',
			url: '/assets/audio/weeknds.mp3',
			cover: '/assets/image/weeknds.jpg',
			id: '9',
		},
		{	title: 'Best Time',
			artist: 'FASS',
			duration: '2:08',
			url: '/assets/audio/besttime.mp3',
			cover: '/assets/image/besttime.jpg',
			id: '10',
		},
		{	title: 'Whip',
			artist: 'Praz',
			duration: '2:44',
			url: '/assets/audio/whip.mp3',
			cover: '/assets/image/whip.jpg',
			id: '11',
		},
		{	title: 'Sweet Love',
			artist: 'Dayfox',
			duration: '3:13',
			url: '/assets/audio/sweetlove.mp3',
			cover: '/assets/image/sweetlove.jpg',
			id: '12',
		},
		{	title: 'Brainfluid',
			artist: 'CINIM',
			duration: '3:13',
			url: '/assets/audio/brainfluid.mp3',
			cover: '/assets/image/brainfluid.jpg',
			id: '13',
		},
		{	title: 'Euphoria',
			artist: 'Playsound',
			duration: '2:16',
			url: '/assets/audio/euphoria.mp3',
			cover: '/assets/image/euphoria.jpg',
			id: '14',
		},
		{	title: 'Into The Night',
			artist: 'Prazkhanal',
			duration: '2:16',
			url: '/assets/audio/intothenight.mp3',
			cover: '/assets/image/intothenight.jpg',
			id: '15',
		},
	]

	let currentSongIndex;
	let currentPlaylist = [...allSongs];
	let que = [...currentPlaylist];
	let currentSong = que[0];
	let isPlaying = false;
	let isRepeat = false;
	let isShuffle = false;
	const audio = new Audio();
	let timerID;

	const songsContainer = document.querySelector('.songs__container');
	let songButtons;
	const playButton = document.querySelector('.songs__play-button');
	const playButtonImage = document.querySelector('.songs__play-button img');
	const previousButton = document.querySelector('.songs__previous-button');
	const nextButton = document.querySelector('.songs__next-button');
	const volumeRange = document.querySelector('.songs__volume-range');
	const timelineRange = document.querySelector('.songs__timeline-range');
	const timeStampCurrentTime = document.querySelector('.songs__timestamp-current-time');
	const timeStampDuration = document.querySelector('.songs__timestamp-duration');
	const currentSongCoverImage = document.querySelector('.songs__current-song-cover img');
	const currentSongTitle = document.querySelector('.songs__current-song-title');
	const currentSongArtist = document.querySelector('.songs__current-song-artist');
	const repeatButton = document.querySelector('.songs__repeat-button');
	const shuffleButton = document.querySelector('.songs__shuffle-button');
	const muteButton = document.querySelector('.songs__mute-button');
	const muteButtonImage = document.querySelector('.songs__mute-button img');
	function addQuerySelector() {
		songButtons = document.querySelectorAll('.songs__song');
	}

	playButton.addEventListener('click', handlePlayButtonClick);
	previousButton.addEventListener('click', handlePreviousButtonClick);
	nextButton.addEventListener('click', handleNextButtonClick);
	volumeRange.addEventListener('input', handleVolumeRangeInput);
	timelineRange.addEventListener('input', handleTimelineRangeInput);
	repeatButton.addEventListener('click', handleRepeatButtonClick);
	shuffleButton.addEventListener('click', handleShuffleButtonClick);

	function addEventListeners() {
		for (const songButton of songButtons) {
			songButton.addEventListener('click', handleSongButtonClick);
		}
	}

	function handleNextButtonClick() {
		if (!isRepeat) {
			increaseCurrentSongIndex();
		}
		setCurrentSong();
		changeAudioSource();
		isPlaying = true;
		renderAudio();
		renderHTML();
	}

	function handlePreviousButtonClick() {
		if (!isRepeat) {
			decreaseCurrentSongIndex();
		}
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
		setVolume();
		renderHTML();
	}

	function handleTimelineRangeInput() {
		const valueInput = timelineRange.value;
		const roundedDuration = audio.duration;
		const valueInputToCurrentTime =  valueInput * roundedDuration / 100;

		audio.currentTime = valueInputToCurrentTime;
	}

	function handleSongButtonClick(event) {
		const [clickedSong, clickedSongIndex] = getPropertiesOfClickedSong(event);
		currentSong = clickedSong;
		currentSongIndex = clickedSongIndex;
		changeAudioSource();
		isPlaying = true;
		renderAudio();
		renderHTML();

		timerID = setInterval(renderTimeline, 10)
	}

	function handleRepeatButtonClick() {
		toggleRepeat();
		renderHTML();
	}

	function toggleRepeat() {
		isRepeat = !isRepeat;
	}

	
	function handleShuffleButtonClick() {
		toggleShuffle();
		shuffleSongs();
		renderHTML();
	}

	function toggleShuffle() {
		isShuffle = !isShuffle;
	}
	
	// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	function shuffleSongs() {
		if (isShuffle) {
			for (let index = que.length - 1; index > 0; index -= 1) {
				const j = Math.floor(Math.random() * (index + 1));
				[que[index], que[j]] = [que[j], que[index]];
			}
		} else {
			que = [...currentPlaylist];
		}
	}

	function setVolume() {
		const rangeInput = volumeRange.value;
		audio.volume = rangeInput / 100;
	}

	function increaseCurrentSongIndex() {
		if (currentSongIndex < currentPlaylist.length - 1) {
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
		currentSong = que[currentSongIndex];
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
			if (!isRepeat) {
				increaseCurrentSongIndex();
			}
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
		renderSongList();
		renderCurrentSong();
		renderPlayButton();
		renderShuffleButton();
		renderRepeatButton();
		renderMuteButton();
	}

	function renderMuteButton() {
		if (audio.volume === 0) {
			muteButtonImage.src = '/assets/svg/no-audio.svg';
		} else {
			muteButtonImage.src = '/assets/svg/audio.svg';
		}
	}

	function renderRepeatButton() {
		if (isRepeat) {
			repeatButton.classList.add('songs__button--active');
		} else {
			repeatButton.classList.remove('songs__button--active');
		}
	}

	function renderPlayButton() {
		if (isPlaying) {
			playButtonImage.src = '/assets/svg/pause.svg';
		} else {
			playButtonImage.src = '/assets/svg/play.svg';
		}
	}

	function renderShuffleButton() {
		if (isShuffle) {
			shuffleButton.classList.add('songs__button--active');
		} else {
			shuffleButton.classList.remove('songs__button--active');
		}
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
		if (currentSong) {
			currentSongCoverImage.src = currentSong.cover;
			currentSongTitle.innerText = currentSong.title;
			currentSongArtist.innerText = currentSong.artist;
		}
	}

	function renderSongList() {
		songsContainer.innerHTML = ''

		for (let index = 0; index < currentPlaylist.length; index += 1) {
			const song = document.createElement('button');
			song.className = 'songs__song';
			song.dataset.id = `${currentPlaylist[index].id}`;

			const songNumber = document.createElement('p');
			songNumber.className = 'songs__song-number';
			songNumber.innerHTML = `${index + 1}`;
			song.append(songNumber);

			const songCover = document.createElement('div')
			songCover.className = 'songs__song-cover'
			const songCoverImage = document.createElement('img')
			songCoverImage.src = `${currentPlaylist[index].cover}`
			songCover.append(songCoverImage);
			song.append(songCover);

			const songTitle = document.createElement('p');
			songTitle.className = 'songs__song-title';
			songTitle.innerHTML = `${currentPlaylist[index].title}`;
			song.append(songTitle);
			
			const songArtist = document.createElement('p');
			songArtist.className = 'songs__song-artist';
			songArtist.innerHTML = `${currentPlaylist[index].artist}`;
			song.append(songArtist);

			const songDuration = document.createElement('p');
			songDuration.className = 'songs__song-duration';
			songDuration.innerHTML = `${currentPlaylist[index].duration}`;
			song.append(songDuration);

			songsContainer.append(song);

			addQuerySelector();
			addEventListeners();
		}
	}

	setInterval(goToNextSongIfFinished, 1000)
	renderHTML();
}

