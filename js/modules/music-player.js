export default function MusicPlayer() {

	const songs = [
		{	title: 'Lifelike',
			artist: 'Alexi Action',
			duration: '2:24',
			url: '/assets/audio/lifelike.mp3',
			cover: '/assets/image/lifelike.jpg',
		},
		{	title: 'Mountain Path',
			artist: 'Magnetic',
			duration: '3:28',
			url: '/assets/audio/mountainpath.mp3',
			cover: '/assets/image/mountainpath.jpg',
		},		
		{	title: 'Please Calm My Mind',
			artist: 'Lesfm',
			duration: '2:55',
			url: '/assets/audio/pleasecalmmymind.mp3',
			cover: '/assets/image/pleasecalmmymind.jpg',
		},		
		{	title: 'Drop It',
			artist: 'Coma',
			duration: '1:42',
			url: '/assets/audio/dropit.mp3',
			cover: '/assets/image/dropit.jpg',
		},
		{	title: 'Password Infinity',
			artist: 'Evgeny',
			duration: '2:25',
			url: '/assets/audio/passwordinfinity.mp3',
			cover: '/assets/image/passwordinfinity.jpg',
		},
		{	title: 'The Beat of Nature',
			artist: 'Olexy',
			duration: '2:53',
			url: '/assets/audio/thebeatofnature.mp3',
			cover: '/assets/image/thebeatofnature.jpg',
		},
	]

	const songsContainer = document.querySelector('.songs__container')
	
	function renderHTML() {
		renderSongs();
	}

	function renderSongs() {
		for (let index = 0; index < songs.length; index += 1) {
			const song = document.createElement('div');
			song.className = 'songs__song';

			const songNumber = document.createElement('p');
			songNumber.className = 'songs__song-number';
			songNumber.innerHTML = `${index + 1}`;
			song.append(songNumber);

			const songCover = document.createElement('div')
			songCover.className = 'songs__song-cover'
			const songCoverImage = document.createElement('img')
			songCoverImage.src = `${songs[index].cover}`
			songCover.append(songCoverImage);
			song.append(songCover);

			const songTitle = document.createElement('p');
			songTitle.className = 'songs__song-title';
			songTitle.innerHTML = `${songs[index].title}`;
			song.append(songTitle);
			
			const songArtist = document.createElement('p');
			songArtist.className = 'songs__song-artist';
			songArtist.innerHTML = `${songs[index].artist}`;
			song.append(songArtist);

			const songDuration = document.createElement('p');
			songDuration.className = 'songs__song-duration';
			songDuration.innerHTML = `${songs[index].duration}`;
			song.append(songDuration);

			songsContainer.append(song);
		}
	}

	renderHTML();
}

