import Playlists from "./music-player/playlist.js";

export default function MusicPlayer() {
	const playlistsModule = Playlists();

	let isPlaying = false;
	let isRepeat = false;
	let isShuffle = false;
	let currentSong = null;

	let currentPlaylist = [...playlistsModule.allSongs.songs];
	let currentSongIndex = null;
	let playlists = null;
	let que = [...currentPlaylist];
	
	const audio = new Audio();
	let currentVolume = null;
	
	let isPlaylistMenuOpen = false;
	let isContextMenuOpen = false;
	
	let indexOfClickedContextMenuButton = null;
	
	let timerID;
	
	const songsElement = document.querySelector('.songs');
	const songsContainer = document.querySelector('.songs__container');
	let songButtons = null;
	let currentSorting = null;
	
	const contextMenu = document.querySelector('.songs__context-menu');
	let contextMenuButtons = null;

	const titleButton = document.querySelector('.songs__title-button');
	const artistButton = document.querySelector('.songs__artist-button');
	const durationButton = document.querySelector('.songs__duration-button');
	
	const playlistButton = document.querySelector('.songs__playlist-button');
	const addPlaylistButton = document.querySelector('.playlist__add-playlist-button');
	const playlistContainer = document.querySelector('.playlists__container');
	let addToPlaylistButtons = null;

	const playButton = document.querySelector('.audio-player__play-button');
	const playButtonImage = document.querySelector('.audio-player__play-button img');
	const previousButton = document.querySelector('.audio-player__previous-button');
	const nextButton = document.querySelector('.audio-player__next-button');
	const volumeRange = document.querySelector('.audio-player__volume-range');
	const timelineRange = document.querySelector('.audio-player__timeline-range');
	const timeStampCurrentTime = document.querySelector('.audio-player__current-time');
	const timeStampDuration = document.querySelector('.audio-player__duration');
	const currentSongCoverImage = document.querySelector('.audio-player__cover img');
	const currentSongTitle = document.querySelector('.audio-player__title');
	const currentSongArtist = document.querySelector('.audio-player__artist');
	const repeatButton = document.querySelector('.audio-player__repeat-button');
	const shuffleButton = document.querySelector('.audio-player__shuffle-button');
	const muteButton = document.querySelector('.audio-player__mute-button');
	const muteButtonImage = document.querySelector('.audio-player__mute-button img');

	function addQuerySelector() {
		songButtons = document.querySelectorAll('.songs__song');
		addToPlaylistButtons = document.querySelectorAll('.songs__add-to-playlist-button');
		contextMenuButtons = document.querySelectorAll('.songs__context-menu-item');
		playlists = document.querySelectorAll('.playlists__playlist');
	}
	
	titleButton.addEventListener('click', handleTitleButtonClick);
	artistButton.addEventListener('click', handleArtistButtonClick);
	durationButton.addEventListener('click', handleDurationButtonClick);

	playlistButton.addEventListener('click', handlePlaylistButtonClick);
	addPlaylistButton.addEventListener('click', handleAddPlaylistButton)

	playButton.addEventListener('click', handlePlayButtonClick);
	previousButton.addEventListener('click', handlePreviousButtonClick);
	nextButton.addEventListener('click', handleNextButtonClick);
	volumeRange.addEventListener('input', handleVolumeRangeInput);
	timelineRange.addEventListener('input', handleTimelineRangeInput);
	repeatButton.addEventListener('click', handleRepeatButtonClick);
	shuffleButton.addEventListener('click', handleShuffleButtonClick);
	muteButton.addEventListener('click', handleMuteButtonClick);
	window.addEventListener('click', handleWindowClick);

	function addEventListeners() {
		for (const songButton of songButtons) {
			songButton.addEventListener('click', handleSongButtonClick);
		}

		for (let index = 0; index < addToPlaylistButtons.length; index += 1) {
			addToPlaylistButtons[index].addEventListener('click', (event) => {
				handleAddPlaylistButtonClick(event, index);
			});
		}

		for (let index = 0; index < contextMenuButtons.length; index += 1) {
			contextMenuButtons[index].addEventListener('click', () => {
				handleContextMenuButtonsClick(index) 
			})
		}

		for (let index = 0; index < playlistsModule.allPlaylists.length; index += 1) {
			playlists[index].addEventListener('click', () => {
				handlePlaylistClick(index);
			})
		}
	}

	function handlePlaylistButtonClick() {
		togglePlaylistMenu();
		renderHTML();
	}

	function togglePlaylistMenu() {
		isPlaylistMenuOpen = !isPlaylistMenuOpen;
	}
	
	function handleAddPlaylistButton() {
		addNewPlaylist();
		renderHTML();
	}

	function handlePlaylistClick(index) {
		currentPlaylist = [...playlistsModule.allPlaylists[index].songs]
		que = [...currentPlaylist]
		renderHTML();
	}

	function handleTitleButtonClick() {
		currentSorting = 'title';
		sortCurrentPlaylist();
		setQue();
		renderHTML();
	}

	function handleArtistButtonClick() {
		currentSorting = 'artist';
		sortCurrentPlaylist();
		setQue();
		renderHTML();
	}

	function handleDurationButtonClick() {
		currentSorting = 'duration';
		sortCurrentPlaylist();
		setQue();
		renderHTML();
	}
	
	function handleContextMenuButtonsClick(index) {
		addSongToRightPlaylist(index);
	}

	function handleWindowClick() {
		isContextMenuOpen = false;

		if (isContextMenuOpen) {
			contextMenu.classList.add('songs__context-menu--open');
		} else {
			contextMenu.classList.remove('songs__context-menu--open');
		} 
	}

	function handleAddPlaylistButtonClick(event, index) {
		event.stopPropagation();

		currentIndexOfContextMenuButton = index;

		isContextMenuOpen = !isContextMenuOpen;

		if (isContextMenuOpen) {
			contextMenu.classList.add('songs__context-menu--open');
		} else {
			contextMenu.classList.remove('songs__context-menu--open');
		} 

		const x = event.clientX;
		const y = event.clientY;

		contextMenu.style.top = `${y}px`;
		contextMenu.style.left = `${x}px`;
	}

	function handleNextButtonClick() {
		setIndexOfCurrentSong();
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
		setIndexOfCurrentSong();
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
		setCurrentVolume();
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

	function handleMuteButtonClick() {
		toggleMute();
		renderHTML();
	}

	function addSongToRightPlaylist(index) {
		const selectedSong = currentPlaylist[currentIndexOfContextMenuButton];
		const selectedPlaylist = playlistsModule.allPlaylists[index + 1].songs;
		selectedPlaylist.push(selectedSong);
	}

	function sortCurrentPlaylist() {
		currentPlaylist.sort((a, b) => {
			return a[currentSorting] > b[currentSorting] ? 1 : -1;
		});
	}

	function setQue() {
		que = [...currentPlaylist];
	}

	function setIndexOfCurrentSong() {
		const idOfCurrentSong = currentSong.id;

		for (let index = 0; index < que.length; index += 1) {
			if (que[index].id === idOfCurrentSong) {
				currentSongIndex = index;
				break;
			}
		}
	}

	function addNewPlaylist() {
		const amountOfPlaylists = playlistsModule.allPlaylists.length;

		const newPlaylist = {
			name: `Playlist ${amountOfPlaylists}`,
			songs: [],
		}

		playlistsModule.allPlaylists.push(newPlaylist);
	}

	function setCurrentVolume() {
		currentVolume = audio.volume;
	}

	function toggleMute() {
		if (audio.volume === 0) {
			audio.volume = currentVolume;
		} else {
			audio.volume = 0;
		}
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

		for (let index = 0; index < playlistsModule.allSongs.songs.length; index += 1) {
			if (playlistsModule.allSongs.songs[index].id === clickedSong) {
				return [playlistsModule.allSongs.songs[index], index];
			}
		}
	}

	function changeAudioSource() {
		audio.src = currentSong.url;
	}
	
	function renderHTML() {
		renderSongList();
		renderPlaylist();
		renderCurrentSong();
		renderPlayButton();
		renderShuffleButton();
		renderRepeatButton();
		renderMuteButton();
		renderVolumeRange();
		renderPlaylistMenu();
		renderItemsInContextMenu();

		addQuerySelector();
		addEventListeners();
	}

	function renderItemsInContextMenu() {
		contextMenu.innerHTML = '';

		for (let index = 1; index < playlistsModule.allPlaylists.length; index += 1) {
			const menuItem = document.createElement('li');
			const button = document.createElement('button');
	
			button.className = 'songs__context-menu-item';
			button.innerText = `${playlistsModule.allPlaylists[index].name}`;
	
			menuItem.append(button);
			contextMenu.append(menuItem);
		}
	}

	function renderPlaylistMenu() {
		if (isPlaylistMenuOpen) {
			songsElement.classList.add('songs--playlist-open');
		} else {
			songsElement.classList.remove('songs--playlist-open');	
		}
	}

	function renderVolumeRange() {
		volumeRange.value = audio.volume * 100;
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

	function renderPlaylist() {
		playlistContainer.innerHTML = '';

		for (let index = 0; index < playlistsModule.allPlaylists.length; index += 1) {
			const playlist = document.createElement('button');
			playlist.className = 'playlists__playlist';
			playlist.innerText = `${playlistsModule.allPlaylists[index].name}`;

			playlistContainer.append(playlist);
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

			const addPlaylist = document.createElement('button');
			addPlaylist.className = 'songs__add-to-playlist-button';
			addPlaylist.innerHTML = '<img src="/assets/svg/add-to-playlist.svg">'
			song.append(addPlaylist);

			songsContainer.append(song);
		}
	}

	setInterval(goToNextSongIfFinished, 1000)
	renderHTML();
}

