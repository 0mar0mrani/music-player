export default function Playlists() {
	const allSongs = {
		name: 'All Songs',
		deletable: false,
		songs:[
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
	}

	let allPlaylists = [allSongs]

	function storePlaylistLocally() {
		const serializedAllPlaylist = JSON.stringify(allPlaylists);
		window.localStorage.setItem('playlists', serializedAllPlaylist);
	}

	function getLocalAllPlaylists() {
		const localPlaylists = window.localStorage.getItem('playlists');
		const parsedLocalPlaylist = JSON.parse(localPlaylists);

		if (localPlaylists) {
			allPlaylists = parsedLocalPlaylist;
		}
	}

	getLocalAllPlaylists();
	
	return {
		allSongs,
		allPlaylists,
		storePlaylistLocally,
		getLocalAllPlaylists,
	}
}