import Playlists from "./music-player/playlist.js";

export default function MusicPlayer() {
	const playlistsModule = Playlists();

	let isPlaying = false;
	let isRepeat = false;
	let isShuffle = false;

	let currentSong = null;
	let currentSongIndex = 0;
	let currentPlaylist = null;
	let currentPlaylistIndex = 0;
	let currentPlaylistForShuffle = null;
	let currentSorting = null;
	
	const audio = new Audio();
	let currentVolume = 1;
	
	let isPlaylistMenuOpen = false;
	let isContextMenuOpen = false;
	let isMobilePlayerOpen = false;
	let indexOfClickedContextMenuButton = null;
	let timerID;
	
	const musicPlayerContainer = document.querySelector('.music-player-container')
	const musicPlayer = document.querySelector('.music-player');
	
	const songsContainer = document.querySelector('.songs');
	let songButtons = null;
	let contextMenuButtons = null;
	let renamePlaylistInput = null;

	const sortingButtons = document.querySelectorAll('.header__category-button');
	const headerButtonArrowIcons = document.querySelectorAll('.header__button-arrow ');
	const playlistButton = document.querySelector('.header__playlist-button');
	const playlistButtonIcon = document.querySelector('.header__playlist-button img');
	
	const contextMenu = document.querySelector('.context-menu');
	const contextMenuUl = document.querySelector('.context-menu ul');
	const deleteSongButton = document.querySelector('.context-menu__delete-song-button');
	let contextMenuPlaylistButtons = null;
	
	const playlistView = document.querySelector('.playlists');
	const addPlaylistButton = document.querySelector('.playlist__add-playlist-button');
	const playlistContainer = document.querySelector('.playlists__container');
	let playlists = null;
	let playlistDeleteButtons = null;
	
	const audioPlayer = document.querySelector('.audio-player');
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
	const playerMobileButton = document.querySelector('.audio-player__close-mobile-player-button')

	function addQuerySelector() {
		songButtons = document.querySelectorAll('.songs__song');
		contextMenuButtons = document.querySelectorAll('.songs__add-to-playlist-button');
		contextMenuPlaylistButtons = document.querySelectorAll('.context-menu__item');
		playlists = document.querySelectorAll('.playlists__playlist');
		playlistDeleteButtons = document.querySelectorAll('.playlist__playlist-delete-button');
		renamePlaylistInput = document.querySelector('.songs__playlist-title-input');
	}

	window.addEventListener('DOMContentLoaded', handleWindowDOMContentLoaded)
	window.addEventListener('resize', handleWindowResize)
	
	musicPlayer.addEventListener('click', handleMusicPlayerClick);

	for (const sortingButton of sortingButtons) {
		sortingButton.addEventListener('click', handleSortingButtonClick);
	}
	addPlaylistButton.addEventListener('click', handleAddPlaylistClick)
	deleteSongButton.addEventListener('click', handleDeleteSongButtonClick)
	playlistView.addEventListener('click', handlePlaylistViewClick)
	playlistButton.addEventListener('click', handlePlaylistButtonClick);

	audioPlayer.addEventListener('click', handleAudioPlayerClick)
	playButton.addEventListener('click', handlePlayButtonClick);
	previousButton.addEventListener('click', handlePreviousButtonClick);
	nextButton.addEventListener('click', handleNextButtonClick);
	volumeRange.addEventListener('input', handleVolumeRangeInput);
	timelineRange.addEventListener('input', handleTimelineRangeInput);
	repeatButton.addEventListener('click', handleRepeatButtonClick);
	shuffleButton.addEventListener('click', handleShuffleButtonClick);
	muteButton.addEventListener('click', handleMuteButtonClick);
	playerMobileButton.addEventListener('click', handlePlayerMobileButtonClick);

	function addEventListeners() {
		for (const songButton of songButtons) {
			songButton.addEventListener('dblclick', handleSongButtonClick);
		}

		for (let index = 0; index < contextMenuButtons.length; index += 1) {
			contextMenuButtons[index].addEventListener('click', (event) => {
				handleAddPlaylistButtonClick(event, index);
			});
		}

		for (let index = 0; index < contextMenuPlaylistButtons.length; index += 1) {
			contextMenuPlaylistButtons[index].addEventListener('click', () => {
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

	function handleWindowDOMContentLoaded() {
		updateWindowInnerHeight();
	}

	function handleWindowResize() {
		updateWindowInnerHeight();
	}

	function handleMusicPlayerClick() {
		isPlaylistMenuOpen = false;
		isContextMenuOpen = false;
		renderHTML();
	}

	function handleSongButtonClick(event) {
		if (!isPlaylistMenuOpen) {
			const songObject = returnGetSongOfClickedSong(event);
			currentSong = songObject;
			changeAudioSource();
			isPlaying = true;
			renderAudio();
			renderHTML();
		}

		timerID = setInterval(renderTime, 10)
	}

	function handleAddPlaylistButtonClick(event, index) {
		event.stopPropagation();
		indexOfClickedContextMenuButton = index;
		isContextMenuOpen = true;
		renderHTML(event);
	}

	function handleRenamePlaylistClick(event) {
		event.stopPropagation();
	}
	
	function handleRenamePlaylistInput() {
		renamePlaylist();
		playlistsModule.storePlaylistLocally();
		updateCurrentPlaylist();	
	}
	
	function handleRenamePlaylistKeyup(event) {
		if (event.key === 'Enter') {
			renamePlaylistInput.blur();
		}
	}
	function handleSortingButtonClick(event) {
		updateCurrentSorting(event);
		sortCurrentPlaylist();
		UpdateCurrentPlaylistForShuffle();
		renderHTML();
	}

	function handlePlaylistButtonClick(event) {
		event.stopPropagation();
		togglePlaylistMenu();
		isContextMenuOpen = false;
		renderHTML();
	}

	function handleDeleteSongButtonClick() {
		deleteSongFromPlaylist();
		playlistsModule.storePlaylistLocally(); 
		updateCurrentPlaylist();
		renderHTML();
	}

	function handleContextMenuButtonsClick(index) {
		addSongToPlaylist(index);
		playlistsModule.storePlaylistLocally(); 
		updateCurrentPlaylist();
		renderHTML();
	}

	function handlePlaylistViewClick(event) {
		event.stopPropagation();
	}

	function handleAddPlaylistClick() {
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

	function handlePlaylistDeleteButtonClick(event, index) {
		event.stopPropagation();
		deletePlaylist(index);
		playlistsModule.storePlaylistLocally();
		renderHTML();
	}

	function handleAudioPlayerClick() {
		const mobileWidth = 750;
		if (window.innerWidth < mobileWidth) {
		isMobilePlayerOpen = true;
			audioPlayer.removeEventListener('click', handleAudioPlayerClick);
		renderHTML();
	}
	}

	function handlePlayerMobileButtonClick(event) {
		event.stopPropagation();
		isMobilePlayerOpen = false;
		audioPlayer.addEventListener('click', handleAudioPlayerClick);
		renderHTML();
	}

	function handlePlayButtonClick(event) {
		event.stopPropagation();
		toggleIsPlaying();
		renderAudio();
		renderHTML();
		if (isPlaying) {
			timerID = setInterval(renderTime, 10);
		} else {
			clearInterval(timerID);
		}
	}

	function handlePreviousButtonClick() {
		updateCurrentSongIndex();
		if (!isRepeat) {
			decreaseCurrentSongIndex();
		}
		updateCurrentSong();
		changeAudioSource();
		isPlaying = true;
		renderAudio();
		renderHTML();
	}

	function handleNextButtonClick() {
		updateCurrentSongIndex();
		if (!isRepeat) {
			increaseCurrentSongIndex();
		}
		updateCurrentSong();
		changeAudioSource();
		isPlaying = true;
		renderAudio();
		renderHTML();
	}

	function handleVolumeRangeInput() {
		setCurrentVolume();
		setVolume();
		renderHTML();
	}

	function handleTimelineRangeInput() {
		setCurrentTime();
	}

	function handleRepeatButtonClick() {
		toggleRepeat();
		renderHTML();
	}

	function handleShuffleButtonClick() {
		toggleShuffle();
		shuffleSongs();
		renderHTML();
	}

	function handleMuteButtonClick() {
		toggleMute();
		renderHTML();
	}

	function updateWindowInnerHeight() {
		const height = window.innerHeight;

		musicPlayerContainer.style.height = `${height}px`;
	}

	/**
	 * Adds song to user playlist
	 * @see indexOfClickedContextMenuButton is the index of clicked context menu button
	 * @see selectedPlaylist we add 1 to the index so playlists in context menu and playlists overview correlates, because the context menu does not contain All Songs
	 * @param {number} index of button clicked in context menu
	 */
	function addSongToPlaylist(index) {
		const selectedSong = currentPlaylist.songs[indexOfClickedContextMenuButton];
		const selectedPlaylist = playlistsModule.allPlaylists[index + 1].songs;
		selectedPlaylist.push(selectedSong);
	}

	function updateCurrentSorting(event) {
		const category = event.currentTarget.dataset.category;
		if (currentSorting === category) {
			currentSorting = null;
		} else {
			currentSorting = category;
		}
	}

	/**
	 * Sorts currentPlaylist based on current sorting: title, artist and duration
	 * @see currentPlaylist
	 * If currentSorting is null, it takes a copy of the original playlist i.e. not sorted
	 * @see playlistsModule.allPlaylists[currentPlaylistIndex]
	 * Used JSON to get a deep copy of the object
	 */
	function sortCurrentPlaylist() {
		if (currentSorting !== null) {
			currentPlaylist.songs.sort((a, b) => {
				return a[currentSorting] > b[currentSorting] ? 1 : -1;
			});
		} else {
			currentPlaylist = JSON.parse(JSON.stringify(playlistsModule.allPlaylists[currentPlaylistIndex]));
		}
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

	function renamePlaylist() {
		let newName = renamePlaylistInput.value;

		if (newName === '') {
			newName = 'Unnamed Playlist';
		}

		playlistsModule.allPlaylists[currentPlaylistIndex].name = newName;
	}

	function deleteSongFromPlaylist() {
		const currentPlaylistDirectory = playlistsModule.allPlaylists[currentPlaylistIndex].songs;
		currentPlaylistDirectory.splice(indexOfClickedContextMenuButton, 1);	
	}

	function UpdateCurrentPlaylistForShuffle() {
		currentPlaylistForShuffle = [...currentPlaylist.songs];
	}

	/**
	 * Updates playlist variables 
	 * @see currentPlaylist
	 * @see currentPlaylistForShuffle
	 * Used JSON to get a deep copy of the object
	 */
	function updateCurrentPlaylist() {
		currentPlaylist = JSON.parse(JSON.stringify(playlistsModule.allPlaylists[currentPlaylistIndex]));
		currentPlaylistForShuffle = [...currentPlaylist.songs]
	}

	function updateCurrentSong() {
		currentSong = currentPlaylistForShuffle[currentSongIndex];
	}

	/**
	 * Sets the currentSongIndex based on its index in currentPlaylistForShuffle
	 * @see currentPlaylistForShuffle
	 */
	function updateCurrentSongIndex() {
		const idOfCurrentSong = currentSong.id;

		for (let index = 0; index < currentPlaylistForShuffle.length; index += 1) {
			if (currentPlaylistForShuffle[index].id === idOfCurrentSong) {
				currentSongIndex = index;
				break;
			}
		}
	}

	/**
	 * @author Laurens Holst // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	 * Shuffles currentPlaylistForShuffle 
	 * The loop starts from the end of array and places it at a random index for each song by swapping place with another song
	 * If IsShuffle is false, we get a copy of currentPlaylist - i.e. currentPlaylistForShuffle is not shuffled anymore
	 * @see isShuffle
	 */
	function shuffleSongs() {
		if (isShuffle) {
			for (let index = currentPlaylistForShuffle.length - 1; index > 0; index -= 1) {
				const randomIndex = Math.floor(Math.random() * (index + 1));
				[currentPlaylistForShuffle[index], currentPlaylistForShuffle[randomIndex]] = [currentPlaylistForShuffle[randomIndex], currentPlaylistForShuffle[index]];
			}
		} else {
			currentPlaylistForShuffle = [...currentPlaylist.songs];
		}
	}

	function setCurrentVolume() {
		currentVolume = audio.volume;
	}

	function setCurrentTime() {
		const valueInput = timelineRange.value;
		const duration = audio.duration;
		const valueInputToCurrentTime =  valueInput * duration / 100;

		audio.currentTime = valueInputToCurrentTime;
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

	function toggleShuffle() {
		isShuffle = !isShuffle;
	}


	function togglePlaylistMenu() {
		isPlaylistMenuOpen = !isPlaylistMenuOpen;
	}

	function toggleIsPlaying() {
		isPlaying = !isPlaying;
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

	function renderAudio() {
		if (isPlaying) {
			audio.play();
		} else {
			audio.pause();
		}
	}

	/**
	 * Goes to the next show if song is finished
	 */
	function goToNextSongIfFinished() {
		const isCurrentSongFinished = returnCheckIfSongFinished();
		
		if (isCurrentSongFinished) {
			if (!isRepeat) {
				increaseCurrentSongIndex();
			}
			updateCurrentSong();
			changeAudioSource();
			isPlaying = true;
			renderAudio();
			renderHTML();
		}
	}

	/**
	 * Checks if song is finished
	 * @returns {boolean}
	 */
	function returnCheckIfSongFinished() {
		const duration = audio.duration;
		const currentTime = audio.currentTime

		if (duration / currentTime === 1) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Goes through allSongs and matches ID with the clicked song 
	 * @see playlistsModule.allSongs
	 * @param {event} click
	 * @returns {object} song
	 */
	function returnGetSongOfClickedSong(event) {
		const clickedSongID = event.currentTarget.dataset.id;

		for (let index = 0; index < playlistsModule.allSongs.songs.length; index += 1) {
			const song = playlistsModule.allSongs.songs[index];

			if (song.id === clickedSongID) {
				return song;
			}
		}
	}

	function changeAudioSource() {
		audio.src = currentSong.url;
	}

	/**
	 * Will only be called once, this sets the fist song of 'All songs' and renders the HTML
	 */
	function initializeMusicPlayer() {
		currentSong = 0;
		currentSongIndex = 0;
		updateCurrentPlaylist();
		updateCurrentSong();
		changeAudioSource();
		renderHTML();
	}
	
	/**
	 * This main function consist of subfunctions that renders the HTML based on the state/model of Javascript.
	 * The last function are query selectors and event listeners for the newly created HTML. 
	 * @see addQuerySelector
	 * @see addEventListeners
	 * @param {event} for renderContextMenu to place the context menu correctly and avoid error when there is no 'click'. 
	 * @see renderContextMenu
	 */
	function renderHTML(event) {
		renderHeader();
		renderSongView();
		renderPlaylists();
		renderCurrentSong();
		renderPlayButton();
		renderShuffleButton();
		renderRepeatButton();
		renderMuteButton();
		renderVolumeRange();
		renderPlaylistMenu();
		renderContextMenu(event);
		renderMobileAudioPlayer();

		addQuerySelector();
		addEventListeners();
	}

	/**
	 * Renders arrow on the sorting buttons based on the state of currentSorting
	 * @see currentSorting
	 */
	function renderHeader() {
		for (const headerButtonArrowIcon of headerButtonArrowIcons) {
			headerButtonArrowIcon.classList.remove('header__button-arrow--visible');
		}

		switch (currentSorting) {
			case 'title':
				headerButtonArrowIcons[0].classList.add('header__button-arrow--visible');
				break
			case 'artist':
				headerButtonArrowIcons[1].classList.add('header__button-arrow--visible');
				break
			case 'duration':
				headerButtonArrowIcons[2].classList.add('header__button-arrow--visible');
				break
		}
	}

	/**
	 * Renders the playlist menu button based on the state of isPlaylistMenuOpen
	 * @see isPlaylistMenuOpen
	 */
	function renderPlaylistMenu() {
		if (isPlaylistMenuOpen) {
			musicPlayer.classList.add('music-player__playlist-open');
			playlistButtonIcon.src = '/assets/svg/close.svg';
		} else {
			musicPlayer.classList.remove('music-player__playlist-open');
			playlistButtonIcon.src = '/assets/svg/menu.svg';
		}
	}


	/**
	 * Renders the mobile music-player based on isMobilePlayerOpen
	 * @see isMobilePlayerOpen
	 */
	function renderMobileAudioPlayer() {
		if (isMobilePlayerOpen) {
			audioPlayer.classList.add('audio-player--open')
		} else {
			audioPlayer.classList.remove('audio-player--open')
		}
	}

	/**
	 * Renders the context menu
	 */
	function renderContextMenu(event) {
		renderVisibility()
		renderDeleteButton();
		renderPlaylistButtons();
		if (event) {
			renderPlacement(event);
		}

		/**
	 	* Renders if the context menu visibility based on the state of isContextMenuOpen
		* @see isContextMenuOpen
	 	*/
		function renderVisibility() {
			if (isContextMenuOpen) {
				contextMenu.classList.add('context-menu--open');
			} else {
				contextMenu.classList.remove('context-menu--open');
			}
		}

		/**
	 	* Renders the delete button based on if currentPlaylist.deletable 
		* @see currentPlaylist.deletable
	 	*/
		function renderDeleteButton() {
			if (currentPlaylist.deletable) {
				deleteSongButton.classList.add('context-menu__delete-song-button--active');
			} else {
				deleteSongButton.classList.remove('context-menu__delete-song-button--active');
			}
		}

		/**
	 	* Renders the all the playlist based on user made playlists in allPlaylist
		* @see playlistsModule.allPlaylists
	 	*/
		function renderPlaylistButtons() {
			contextMenuUl.innerHTML = '';

			for (let index = 1; index < playlistsModule.allPlaylists.length; index += 1) {
				const menuItem = document.createElement('li');
				const button = document.createElement('button');
		
				button.className = 'context-menu__item';
				button.innerText = `${playlistsModule.allPlaylists[index].name}`;
		
				menuItem.append(button);
				contextMenuUl.append(menuItem);
			}
		}
		
		/**
	 	* Renders the placement of context menu from where the click happened
		* If the click happens of the bottom 2/5 of the viewport the context menu appears above the click
		* @see startOfBottomTwoFifth
		* @param {event} is to know where to place the context menu over or below the click 
	 	*/
		function renderPlacement(event) {
			const x = event.clientX;
			const y = event.clientY;
	
			contextMenu.style.top = `${y}px`;
			contextMenu.style.left = `${x}px`;
	
			const windowHeight = window.innerHeight;
			const startOfBottomTwoFifth =  (windowHeight / 5) * 3;
	
			if (event.clientY > startOfBottomTwoFifth) {
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

	/**
	 * Renders timeline, current time and the duration of the song based on duration and currentTime
	 * @see duration
	 * @see currentTime
	 */
	function renderTime() {
		const duration = audio.duration;
		const currentTime = audio.currentTime;

		renderTimeLine();
		renderDuration();
		renderCurrentTime();

		function renderTimeLine() {
			const currentTimeInPercent =  currentTime / duration * 100;
	
			timelineRange.value = currentTimeInPercent;
		}
		
		function renderDuration() {
			const durationInMinutes = Math.floor(Math.floor(duration) / 60);
			const durationInSeconds = Math.floor(duration) - durationInMinutes * 60;
	
			if (!isNaN(durationInMinutes)) {
				timeStampDuration.innerHTML = `${durationInMinutes}:${durationInSeconds}`
			}
		}

		function renderCurrentTime() {
			const currentTimeInMinutes = Math.floor(Math.floor(currentTime) / 60)
			const currentTimeInSeconds = Math.floor(currentTime) - currentTimeInMinutes * 60;
	
			if (!isNaN(currentTimeInMinutes)) {
				timeStampCurrentTime.innerHTML = `${currentTimeInMinutes}:${currentTimeInSeconds}`
			}
		}
	}

	function renderCurrentSong() {
		if (currentSong) {
			currentSongCoverImage.src = currentSong.cover;
			currentSongTitle.innerText = currentSong.title;
			currentSongArtist.innerText = currentSong.artist;
		}
	}


	function renderPlaylists() {
		playlistContainer.innerHTML = '';

		for (let index = 0; index < playlistsModule.allPlaylists.length; index += 1) {
			const playlist = document.createElement('button');
			playlist.className = 'playlists__playlist';

			createPlayListName();
			createDeleteButton();
			playlistContainer.append(playlist);

			function createPlayListName() {
				const playlistName = document.createElement('p');
				playlistName.innerText = `${playlistsModule.allPlaylists[index].name}`;
				playlist.append(playlistName);
			}

			function createDeleteButton() {
				const deleteButton = document.createElement('button');
				deleteButton.className = 'playlist__playlist-delete-button';
				const deleteButtonIcon = document.createElement('img');
				deleteButtonIcon.src = '/assets/svg/close.svg';
				deleteButton.append(deleteButtonIcon);
				playlist.append(deleteButton);
			}
		}
	}

	/**
	 * Renders songs and playlist name in main window from currentPlaylist. If playlist is empty it renders a an 'no songs' message. 
	 */
	function renderSongView() {
		const playlistIsEmpty = currentPlaylist.songs.length === 0;

		songsContainer.innerHTML = '';

		createTitleOfPlaylist();

		if (playlistIsEmpty) {
			createNoSongsMessage();
		} else {
			createSongs();
		}

		function createSongs() {
			for (let index = 0; index < currentPlaylist.songs.length; index += 1) {
				const songElement = returnCreateSongElement(index);

				createSongNumber();
				createSongCover();
				createSongTitle();
				createArtistName();
				createSongDuration();
				if (!isPlaylistMenuOpen) {
					createContextMenu();
				}

				songsContainer.append(songElement);	

				/**
	 			* This renders the main container for one song. 
				* If the song-id is the same as the currentSong it gets the active-class which shows the song currently being played. 
	 			*/
				function returnCreateSongElement() {
					const song = document.createElement('button');
					song.className = 'songs__song';
					if (currentSong.id === currentPlaylist.songs[index].id) {
						song.classList.add('songs__song--active');
					}
					song.dataset.id = `${currentPlaylist.songs[index].id}`;
					return song;
				}
		
				function createSongNumber() {
					const songNumber = document.createElement('p');
					songNumber.className = 'songs__song-number';
					songNumber.innerHTML = `${index + 1}`;
					songElement.append(songNumber);
				}
		
				function createSongCover() {
					const songCover = document.createElement('div')
					songCover.className = 'songs__song-cover'
					const songCoverImage = document.createElement('img')
					songCoverImage.src = `${currentPlaylist.songs[index].cover}`
					songCover.append(songCoverImage);
					songElement.append(songCover);
				}
		
				function createSongTitle() {
					const songTitle = document.createElement('p');
					songTitle.className = 'songs__song-title';
					songTitle.innerHTML = `${currentPlaylist.songs[index].title}`;
					songElement.append(songTitle);
				}
				
				function createArtistName() {
					const songArtist = document.createElement('p');
					songArtist.className = 'songs__song-artist';
					songArtist.innerHTML = `${currentPlaylist.songs[index].artist}`;
					songElement.append(songArtist);
				}
		
				function createSongDuration() {
					const songDuration = document.createElement('p');
					songDuration.className = 'songs__song-duration';
					songDuration.innerHTML = `${currentPlaylist.songs[index].duration}`;
					songElement.append(songDuration);
				}
				
				function createContextMenu() {
					const contextMenu = document.createElement('button');
					contextMenu.className = 'songs__add-to-playlist-button';
					contextMenu.innerHTML = '<img src="/assets/svg/add-to-playlist.svg">'
					songElement.append(contextMenu);
				}
			}
		}

		function createTitleOfPlaylist() {
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
		}

		function createNoSongsMessage() {
			const paragraph = document.createElement('p');
			paragraph.className = 'songs__no-songs-message'
			paragraph.innerHTML = 'No songs in playlist'

			songsContainer.append(paragraph);
		}
	}

	initializeMusicPlayer();
	/**
	 * This checks every second if song is finished, if true, goes to next song.
	 */
	setInterval(goToNextSongIfFinished, 1000);
}

