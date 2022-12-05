export default function Playlists() {
	const allSongs = {
		name: 'All Songs',
		deletable: false,
		renamable: false,
		songs:[
			{	title: 'Lifelike',
				artist: 'Alexi Action',
				duration: '2:24',
				url: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=lifelike-126735.mp3',
				cover: '/assets/image/lifelike.jpg',
				id: '1',
			},
			{	title: 'Mountain Path',
				artist: 'Magnetic',
				duration: '3:28',
				url: 'https://cdn.pixabay.com/download/audio/2022/11/11/audio_684ca37dc0.mp3?filename=mountain-path-125573.mp3',
				cover: '/assets/image/mountainpath.jpg',
				id: '2',
			},		
			{	title: 'Please Calm My Mind',
				artist: 'Lesfm',
				duration: '2:55',
				url: 'https://cdn.pixabay.com/download/audio/2022/11/11/audio_84306ee149.mp3?filename=please-calm-my-mind-125566.mp3',
				cover: '/assets/image/pleasecalmmymind.jpg',
				id: '3',
			},		
			{	title: 'Drop It',
				artist: 'Coma',
				duration: '1:42',
				url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_3ea72d75c6.mp3?filename=drop-it-124014.mp3',
				cover: '/assets/image/dropit.jpg',
				id: '4',
			},
			{	title: 'Password Infinity',
				artist: 'Evgeny',
				duration: '2:25',
				url: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_31c2730e64.mp3?filename=password-infinity-123276.mp3',
				cover: '/assets/image/passwordinfinity.jpg',
				id: '5',
			},
			{	title: 'The Beat of Nature',
				artist: 'Olexy',
				duration: '2:53',
				url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=the-beat-of-nature-122841.mp3',
				cover: '/assets/image/thebeatofnature.jpg',
				id: '6',
			},
			{	title: 'Powerfull',
				artist: 'Penguin',
				duration: '1:13',
				url: 'https://cdn.pixabay.com/download/audio/2022/10/05/audio_686ddcce85.mp3?filename=powerful-beat-121791.mp3',
				cover: '/assets/image/powerful.jpg',
				id: '7',
			},
			{	title: 'The Blackest Bouquet',
				artist: 'LeonellCassio',
				duration: '3:41',
				url: 'https://cdn.pixabay.com/download/audio/2022/08/31/audio_419263fc12.mp3?filename=leonell-cassio-the-blackest-bouquet-118766.mp3',
				cover: '/assets/image/theblackestbouquet.jpg',
				id: '8',
			},
			{	title: 'Weeknds',
				artist: 'Dayfox',
				duration: '3:28',
				url: 'https://cdn.pixabay.com/download/audio/2022/10/12/audio_061cead49a.mp3?filename=weeknds-122592.mp3',
				cover: '/assets/image/weeknds.jpg',
				id: '9',
			},
			{	title: 'Best Time',
				artist: 'FASS',
				duration: '2:08',
				url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_5b08ce8e20.mp3?filename=best-time-112194.mp3',
				cover: '/assets/image/besttime.jpg',
				id: '10',
			},
			{	title: 'Whip',
				artist: 'Praz',
				duration: '2:44',
				url: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_67bcf729cf.mp3?filename=whip-110235.mp3',
				cover: '/assets/image/whip.jpg',
				id: '11',
			},
			{	title: 'Sweet Love',
				artist: 'Dayfox',
				duration: '3:13',
				url: 'https://cdn.pixabay.com/download/audio/2022/10/02/audio_8f97a56643.mp3?filename=sweet-love-121561.mp3',
				cover: '/assets/image/sweetlove.jpg',
				id: '12',
			},
			{	title: 'Brainfluid',
				artist: 'CINIM',
				duration: '3:13',
				url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_84b5738b17.mp3?filename=cinim-brainfluid-122844.mp3',
				cover: '/assets/image/brainfluid.jpg',
				id: '13',
			},
			{	title: 'Euphoria',
				artist: 'Playsound',
				duration: '2:16',
				url: 'https://cdn.pixabay.com/download/audio/2022/09/29/audio_4491b5f092.mp3?filename=euphoria-121294.mp3',
				cover: '/assets/image/euphoria.jpg',
				id: '14',
			},
			{	title: 'Into The Night',
				artist: 'Prazkhanal',
				duration: '2:16',
				url: 'https://cdn.pixabay.com/download/audio/2022/02/15/audio_1e79dbf2b9.mp3?filename=into-the-night-20928.mp3',
				cover: '/assets/image/intothenight.jpg',
				id: '15',
			},
		]
	}

	let allPlaylists = [allSongs];

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
	}
}