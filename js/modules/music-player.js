import Playlists from "./music-player/playlist.js";

export default function MusicPlayer() {
	const playlistsModule = Playlists();

	let isPlaying = false;
	let isRepeat = false;
	let isShuffle = false;
	let currentSong = null;

	let currentPlaylist = playlistsModule.allSongs;
	let currentPlaylistIndex = 0;
	let currentSongIndex = 0;
	let currentPlaylistForSorting = [...currentPlaylist.songs];
	
	const audio = new Audio();
	let currentVolume = null;
	
	let isPlaylistMenuOpen = false;
	let isContextMenuOpen = false;
	
	let indexOfClickedContextMenuButton = null;
	
	let timerID;
	
	const songsElement = document.querySelector('.songs');
	const songsContainer = document.querySelector('.songs__container');
	const titleButton = document.querySelector('.songs__title-button');
	const artistButton = document.querySelector('.songs__artist-button');
	const durationButton = document.querySelector('.songs__duration-button');
	const buttonArrows = document.querySelectorAll('.songs__button-arrow ');
	let songButtons = null;
	let currentSorting = null;
	
	const contextMenu = document.querySelector('.songs__context-menu');
	const contextMenuUl = document.querySelector('.songs__context-menu ul');
	const deleteSongButton = document.querySelector('.songs__context-delete-song');
	let contextMenuButtons = null;
	
	const playlistView = document.querySelector('.playlists');
	const playlistButton = document.querySelector('.songs__playlist-button');
	const playlistButtonIcon = document.querySelector('.songs__playlist-button img');
	const addPlaylistButton = document.querySelector('.playlist__add-playlist-button');
	const playlistContainer = document.querySelector('.playlists__container');
	let playlists = null;
	let renamePlaylistInput = null;
	let addToPlaylistButtons = null;
	let playlistDeleteButtons = null;
	
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
		playlistDeleteButtons = document.querySelectorAll('.playlist__playlist-delete-button');
		renamePlaylistInput = document.querySelector('.songs__playlist-title-input');
	}
	
	songsElement.addEventListener('click', handleSongsElementClick);
	titleButton.addEventListener('click', handleTitleButtonClick);
	artistButton.addEventListener('click', handleArtistButtonClick);
	durationButton.addEventListener('click', handleDurationButtonClick);

	addPlaylistButton.addEventListener('click', handleAddPlaylistButton)
	deleteSongButton.addEventListener('click', handleDeleteSongButtonHandle)
	playlistView.addEventListener('click', (event) => {
		handlePlaylistViewClick(event) 
	})
	playlistButton.addEventListener('click', (event) => {
		handlePlaylistButtonClick(event);
	});

	playButton.addEventListener('click', handlePlayButtonClick);
	previousButton.addEventListener('click', handlePreviousButtonClick);
	nextButton.addEventListener('click', handleNextButtonClick);
	volumeRange.addEventListener('input', handleVolumeRangeInput);
	timelineRange.addEventListener('input', handleTimelineRangeInput);
	repeatButton.addEventListener('click', handleRepeatButtonClick);
	shuffleButton.addEventListener('click', handleShuffleButtonClick);
	muteButton.addEventListener('click', handleMuteButtonClick);
	songsElement.addEventListener('click', handleWindowClick);

	function addEventListeners() {
		for (const songButton of songButtons) {
			songButton.addEventListener('dblclick', handleSongButtonClick);
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

		for (let index = 0; index < playlistDeleteButtons.length; index += 1) {
			playlistDeleteButtons[index].addEventListener('click', (event) => {
				handlePlaylistDeleteButtonClick(event, index)
			})
		}

		renamePlaylistInput.addEventListener('click', handleRenamePlaylistClick);

		renamePlaylistInput.addEventListener('input', handleRenamePlaylistInput)

		renamePlaylistInput.addEventListener('keyup', handleRenamePlaylistKeyup)
	}

	function handleRenamePlaylistKeyup(event) {

		const key = event.key;

		if (key === 'Enter') {
			renamePlaylistInput.blur();
		}
	}

	function handleRenamePlaylistClick(event) {
		event.stopPropagation();
	}

	function handleRenamePlaylistInput() {
		let newName = renamePlaylistInput.value;

		if (newName === '') {
			newName = 'Unnamed Playlist';
		}

		playlistsModule.allPlaylists[currentPlaylistIndex].name = newName;
		playlistsModule.storePlaylistLocally();
		updateCurrentPlaylist();	
	}

	function handlePlaylistViewClick(event) {
		event.stopPropagation();
	}

	function handlePlaylistButtonClick(event) {
		event.stopPropagation();
		togglePlaylistMenu();
		isContextMenuOpen = false;
		renderHTML();
	}

	function togglePlaylistMenu() {
		isPlaylistMenuOpen = !isPlaylistMenuOpen;
	}
	
	function handleAddPlaylistButton() {
		addNewPlaylist();
		playlistsModule.storePlaylistLocally();
		renderHTML();
	}

	function handlePlaylistClick(index) {
		currentPlaylistIndex = index;
		updateCurrentPlaylist();
		togglePlaylistMenu();
		renderHTML();
	}

	function handleDeleteSongButtonHandle() {
		const currentPlaylistDirectory = playlistsModule.allPlaylists[currentPlaylistIndex].songs;
		currentPlaylistDirectory.splice(indexOfClickedContextMenuButton, 1);
		playlistsModule.storePlaylistLocally(); 		
		updateCurrentPlaylist();
		renderHTML();
	}

	function handleTitleButtonClick() {
		currentSorting = 'title';
		sortCurrentPlaylist();
		setCurrentPlaylistForSorting();
		renderHTML();
	}

	function handleArtistButtonClick() {
		currentSorting = 'artist';
		sortCurrentPlaylist();
		setCurrentPlaylistForSorting();
		renderHTML();
	}

	function handleDurationButtonClick() {
		currentSorting = 'duration';
		sortCurrentPlaylist();
		setCurrentPlaylistForSorting();
		renderHTML();
	}

	function handleSongsElementClick() {
		isPlaylistMenuOpen = false;
		renderHTML();
	}
	
	function handleContextMenuButtonsClick(index) {
		addSongToRightPlaylist(index);
		playlistsModule.storePlaylistLocally(); 
		updateCurrentPlaylist();
		renderHTML();
	}

	function handleWindowClick() {
		isContextMenuOpen = false;
		renderHTML();
	}

	function handleAddPlaylistButtonClick(event, index) {
		event.stopPropagation();

		indexOfClickedContextMenuButton = index;

		isContextMenuOpen = true;

		renderHTML(event);
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
		if (isPlaying) {
			timerID = setInterval(renderTimeline, 10);
		} else {
			clearInterval(timerID);
		}
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
		if (!isPlaylistMenuOpen) {
			const [clickedSong, clickedSongIndex] = getPropertiesOfClickedSong(event);
			currentSong = clickedSong;
			currentSongIndex = clickedSongIndex;
			changeAudioSource();
			isPlaying = true;
			renderAudio();
			renderHTML();
		}

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

	function handlePlaylistDeleteButtonClick(event, index) {
		event.stopPropagation();
		deletePlaylist(index);
		playlistsModule.storePlaylistLocally();
		renderHTML();
	}

	function addSongToRightPlaylist(index) {
		const selectedSong = currentPlaylist.songs[indexOfClickedContextMenuButton];
		const selectedPlaylist = playlistsModule.allPlaylists[index + 1].songs;
		selectedPlaylist.push(selectedSong);
	}

	function sortCurrentPlaylist() {
		currentPlaylist.songs.sort((a, b) => {
			return a[currentSorting] > b[currentSorting] ? 1 : -1;
		});
	}

	function setCurrentPlaylistForSorting() {
		currentPlaylistForSorting = [...currentPlaylist.songs];
	}

	function setIndexOfCurrentSong() {
		const idOfCurrentSong = currentSong.id;

		for (let index = 0; index < currentPlaylistForSorting.length; index += 1) {
			if (currentPlaylistForSorting[index].id === idOfCurrentSong) {
				currentSongIndex = index;
				break;
			}
		}
	}

	function updateCurrentPlaylist() {
		currentPlaylist = playlistsModule.allPlaylists[currentPlaylistIndex];
		currentPlaylistForSorting = [...currentPlaylist.songs]
	}

	function addNewPlaylist() {
		const amountOfPlaylists = playlistsModule.allPlaylists.length;

		const newPlaylist = {
			name: `Playlist ${amountOfPlaylists}`,
			songs: [],
			deletable: true,
			renamable: true,
		}

		playlistsModule.allPlaylists.push(newPlaylist);
	}

	function deletePlaylist(index) {
		playlistsModule.allPlaylists.splice(index, 1);
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
			for (let index = currentPlaylistForSorting.length - 1; index > 0; index -= 1) {
				const j = Math.floor(Math.random() * (index + 1));
				[currentPlaylistForSorting[index], currentPlaylistForSorting[j]] = [currentPlaylistForSorting[j], currentPlaylistForSorting[index]];
			}
		} else {
			currentPlaylistForSorting = [...currentPlaylist];
		}
	}

	function setVolume() {
		const rangeInput = volumeRange.value;
		audio.volume = rangeInput / 100;
	}

	function increaseCurrentSongIndex() {
		if (currentSongIndex < currentPlaylist.songs.length - 1) {
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
		currentSong = currentPlaylistForSorting[currentSongIndex];
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
	
	function renderHTML(event) {
		renderHeader();
		renderSongView();
		renderPlaylistView();
		renderCurrentSong();
		renderPlayButton();
		renderShuffleButton();
		renderRepeatButton();
		renderMuteButton();
		renderVolumeRange();
		renderPlaylistMenu();
		renderContextMenu(event);

		addQuerySelector();
		addEventListeners();
	}

	function renderHeader() {
		for (const buttonArrow of buttonArrows) {
			buttonArrow.classList.remove('songs__button-arrow--visible');
		}

		switch (currentSorting) {
			case 'title':
				buttonArrows[0].classList.add('songs__button-arrow--visible');
				break
			case 'artist':
				buttonArrows[1].classList.add('songs__button-arrow--visible');
				break
			case 'duration':
				buttonArrows[2].classList.add('songs__button-arrow--visible');
				break
		}
	}

	function renderPlaylistMenu() {
		if (isPlaylistMenuOpen) {
			songsElement.classList.add('songs--playlist-open');
			playlistButtonIcon.src = '/assets/svg/close.svg';
		} else {
			songsElement.classList.remove('songs--playlist-open');
			playlistButtonIcon.src = '/assets/svg/menu.svg';
		}
	}

	function renderContextMenu(event) {
		renderVisibility()
		renderDeleteButton();
		renderMenuButtons();

		if (event) {
			renderPlacement();
		}

		function renderVisibility() {
			if (isContextMenuOpen) {
				contextMenu.classList.add('songs__context-menu--open');
			} else {
				contextMenu.classList.remove('songs__context-menu--open');
			}
		}

		function renderDeleteButton() {
			if (currentPlaylist.deletable) {
				deleteSongButton.classList.add('songs__context-delete-song--active');
			} else {
				deleteSongButton.classList.remove('songs__context-delete-song--active');
			}
		}

		function renderMenuButtons() {
			contextMenuUl.innerHTML = '';

			for (let index = 1; index < playlistsModule.allPlaylists.length; index += 1) {
				const menuItem = document.createElement('li');
				const button = document.createElement('button');
		
				button.className = 'songs__context-menu-item';
				button.innerText = `${playlistsModule.allPlaylists[index].name}`;
		
				menuItem.append(button);
				contextMenuUl.append(menuItem);
			}
		}

		function renderPlacement() {
			const x = event.clientX;
			const y = event.clientY;
	
			contextMenu.style.top = `${y}px`;
			contextMenu.style.left = `${x}px`;
	
			const windowHeight = window.innerHeight;
			const startOfBottomTwoThird =  (windowHeight / 5) * 3;
	
			if (event.clientY > startOfBottomTwoThird) {
				contextMenu.style.transform = 'translate(-100%, -100%)';
			} else {
				contextMenu.style.transform = 'translate(-100%)';
			}
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
			repeatButton.classList.add('audio-player__button--active');
		} else {
			repeatButton.classList.remove('audio-player__button--active');
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
			shuffleButton.classList.add('audio-player__button--active');
		} else {
			shuffleButton.classList.remove('audio-player__button--active');
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

	function renderPlaylistView() {
		playlistContainer.innerHTML = '';

		for (let index = 0; index < playlistsModule.allPlaylists.length; index += 1) {
			const playlist = document.createElement('button');
			playlist.className = 'playlists__playlist';

			const playlistName = document.createElement('p');
			playlistName.innerText = `${playlistsModule.allPlaylists[index].name}`;
			playlist.append(playlistName);

			const deleteButton = document.createElement('button');
			deleteButton.className = 'playlist__playlist-delete-button';
			const deleteButtonIcon = document.createElement('img');
			deleteButtonIcon.src = '/assets/svg/close.svg';
			deleteButton.append(deleteButtonIcon);
			playlist.append(deleteButton);

			playlistContainer.append(playlist);
		}
	}

	function renderSongView() {
		const isEmptyPlaylist = currentPlaylist.songs.length === 0;
		songsContainer.innerHTML = '';

		const playlistTitle = document.createElement('div');
		playlistTitle.className = 'songs__playlist-title'

		const titleName = document.createElement('input');
		titleName.value = `${currentPlaylist.name}`;
		titleName.className = 'songs__playlist-title-input';

		if (!currentPlaylist.renamable) {
			titleName.disabled = true;
		} 

		playlistTitle.append(titleName);
		songsContainer.append(playlistTitle);
		
		if (isEmptyPlaylist) {
			const paragraph = document.createElement('p');
			paragraph.className = 'songs__no-songs-message'
			paragraph.innerHTML = 'No songs in playlist'

			songsContainer.append(paragraph);
		} else {
			for (let index = 0; index < currentPlaylist.songs.length; index += 1) {
				const song = document.createElement('button');
				song.className = 'songs__song';
				song.dataset.id = `${currentPlaylist.songs[index].id}`;
				
				const songNumber = document.createElement('p');
				songNumber.className = 'songs__song-number';
				songNumber.innerHTML = `${index + 1}`;
				song.append(songNumber);
				
				const songCover = document.createElement('div')
				songCover.className = 'songs__song-cover'
				const songCoverImage = document.createElement('img')
				songCoverImage.src = `${currentPlaylist.songs[index].cover}`
				songCover.append(songCoverImage);
				song.append(songCover);
				
				const songTitle = document.createElement('p');
				songTitle.className = 'songs__song-title';
				songTitle.innerHTML = `${currentPlaylist.songs[index].title}`;
				song.append(songTitle);
				
				const songArtist = document.createElement('p');
				songArtist.className = 'songs__song-artist';
				songArtist.innerHTML = `${currentPlaylist.songs[index].artist}`;
				song.append(songArtist);
				
				const songDuration = document.createElement('p');
				songDuration.className = 'songs__song-duration';
				songDuration.innerHTML = `${currentPlaylist.songs[index].duration}`;
				song.append(songDuration);
				
				if (!isPlaylistMenuOpen) {
					const addPlaylist = document.createElement('button');
					addPlaylist.className = 'songs__add-to-playlist-button';
					addPlaylist.innerHTML = '<img src="/assets/svg/add-to-playlist.svg">'
					song.append(addPlaylist);
				}
				
				songsContainer.append(song);
			}
		}
	}

	currentSong = currentPlaylistForSorting[0];
	changeAudioSource();
	setInterval(goToNextSongIfFinished, 1000);
	renderHTML();
}

