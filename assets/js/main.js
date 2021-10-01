/*
1. Render songs
2. Scroll Top
3. Play/ pause , seek
4. CD rotate
5. Next/prev song
6. Random song
7. Next/ repeat on ended
8. Active song
9. Scroll active song into view
10. Play song when click
11. Adjust volume
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MY_PLAYER';

const heading = $('header marquee');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const player = $('.player');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const startTime = $('.start-time');
const endTime = $('.end-time');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const volumeBtn = $('.btn-volume');
const volume = $('#volume-adjust');
const favoriteBtn = $('.btn-favorite');

const app = {
	isPlaying: false,
	isRandom: false,
	isRepeat: false,
	currentIndex: 0,
	songTime: 0,
	currentVolume: 0,
	config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
	songs: [
		{
			name: 'Utopia',
			singer: 'Hoaprox',
			path: './assets/music/song1.mp3',
			image: './assets/img/song1.jpg',
		},
		{
			name: 'The memories (Ký ức)',
			singer: 'Hoaprox',
			path: './assets/music/song2.mp3',
			image: './assets/img/song2.jpg',
		},
		{
			name: 'With you (Ngẫu hứng)',
			singer: 'Hoaprox, Nick Strand & Mio',
			path: './assets/music/song3.mp3',
			image: './assets/img/song3.jpg',
		},
		{
			name: 'About love',
			singer: 'Marina',
			path: './assets/music/song4.mp3',
			image: './assets/img/song4.jpg',
		},
		{
			name: 'Thats what I want',
			singer: 'Lil Nas X',
			path: './assets/music/song5.mp3',
			image: './assets/img/song5.jpg',
		},
		{
			name: 'Stay',
			singer: 'The Kid LAROI, Justin Bieber',
			path: './assets/music/song6.mp3',
			image: './assets/img/song6.jpg',
		},
		{
			name: 'The Nights',
			singer: 'Avicii',
			path: './assets/music/song7.mp3',
			image: './assets/img/song7.jpg',
		},
		{
			name: 'Hero',
			singer: 'Cash Cash ft. Christina Perri',
			path: './assets/music/song8.mp3',
			image: './assets/img/song8.jpg',
		},
		{
			name: 'Cưới thôi',
			singer: 'Masew, Masiu, B Ray, TAP',
			path: './assets/music/song9.mp3',
			image: './assets/img/song9.jpg',
		},
		{
			name: 'Nevada',
			singer: 'Vicetone ft. Cozi Zuehlsdorff',
			path: './assets/music/song10.mp3',
			image: './assets/img/song10.jpg',
		},
	],
	randomArray: [],
	setConfig: function (key, value) {
		this.config[key] = value;
		localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
	},
	renderSongs: function () {
		const htmls = this.songs.map((song, index) => {
			return `
            <div class="song ${
				index === this.currentIndex ? 'active' : ''
			}" data-index="${index}">
            <div class="thumb" style="background-image: url(${song.image})">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>
            `;
		});
		playlist.innerHTML = htmls.join('');
	},
	defineProperties: function () {
		Object.defineProperty(this, 'currentSong', {
			get: function () {
				return this.songs[this.currentIndex];
			},
		});
	},
	handleEvents: function () {
		_this = this;
		// Xử lý xoay CD
		const cdThumbAnimate = cdThumb.animate(
			[
				{
					transform: 'rotate(360deg)',
				},
			],
			{
				duration: 7000, //7s
				iterations: Infinity,
			}
		);
		cdThumbAnimate.pause();

		// Xử lý phóng to/ thu nhỏ CD
		const cdWidth = cd.offsetWidth;
		document.onscroll = function () {
			const scrollTop =
				document.documentElement.scrollTop || window.scrollY;
			const newWidth = cdWidth - scrollTop;

			cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
			cd.style.opacity = newWidth / cdWidth;
		};

		// Xử lý pause/ play song
		playBtn.onclick = function () {
			if (_this.isPlaying) {
				audio.pause();
			} else {
				audio.play();
			}
		};

		// Khi song được play
		audio.onplay = function () {
			_this.isPlaying = true;
			player.classList.add('playing');
			cdThumbAnimate.play();
		};
		// Khi song bị pause
		audio.onpause = function () {
			_this.isPlaying = false;
			player.classList.remove('playing');
			cdThumbAnimate.pause();
		};

		// Khi tiến độ bài hát thay đổi
		audio.ontimeupdate = function () {
			if (audio.duration) {
				const progressPercent = Math.floor(
					(audio.currentTime / audio.duration) * 100
				);
				progress.value = progressPercent;
				const currentMin = Math.floor(audio.currentTime / 60);
				const currentSecond = Math.floor(audio.currentTime % 60);
				startTime.innerHTML = `${currentMin}:${
					currentSecond > 9 ? currentSecond : '0' + currentSecond
				}`;
				progress.style.background =
					'linear-gradient(to right, rgb(var(--accent-color)) 0%, rgb(var(--accent-color)) ' +
					progressPercent +
					'%, #d3d3d3 ' +
					progressPercent +
					'%, #d3d3d3 100%)';
			}
		};
		// Khi tua bài hát
		progress.oninput = function (e) {
			const seekTime = (audio.duration / 100) * e.target.value;
			audio.currentTime = seekTime;
		};
		// Khi load xong bài hát, hiển thị thời gian bài hát
		audio.onloadeddata = function () {
			_this.songTime = audio.duration.toFixed();
			let min = Math.floor(_this.songTime / 60);
			let sec = Math.floor(_this.songTime % 60);
			endTime.innerHTML = `${min}:${sec > 9 ? sec : '0' + sec}`;
		};
		// Khi bấm vào nút next
		nextBtn.onclick = function () {
			if (_this.isRandom) {
				_this.randomSong();
			} else {
				_this.nextSong();
			}
			audio.play();
			_this.renderSongs();
			_this.scrollToActiveSong();
		};
		// Khi bấm vào nút prev
		prevBtn.onclick = function () {
			if (_this.isRandom) {
				_this.randomSong();
			} else {
				_this.prevSong();
			}
			audio.play();
			_this.renderSongs();
			_this.scrollToActiveSong();
		};
		//Xử lý bật/tắt random
		randomBtn.onclick = function () {
			_this.isRandom = !_this.isRandom;
			_this.setConfig('isRandom', _this.isRandom);
			randomBtn.classList.toggle('active', _this.isRandom);
		};
		//Xử lý bật/tắt repeat
		repeatBtn.onclick = function () {
			_this.isRepeat = !_this.isRepeat;
			_this.setConfig('isRepeat', _this.isRepeat);
			repeatBtn.classList.toggle('active', _this.isRepeat);
		};
		//Xử lý bật/tắt favorite
		favoriteBtn.onclick = function () {
			favoriteBtn.classList.toggle('active');
		};
		// Xử lý bật mute âm lượng
		volumeBtn.onclick = function () {
			audio.volume = 0;
			_this.currentVolume = audio.volume;
			_this.volumeDisplay();
			volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
		};
		// Xử lý next/repeat khi hết bài hát
		audio.onended = function () {
			if (_this.isRepeat) {
				audio.play();
			} else {
				nextBtn.click();
			}
		};
		// Lắng nghe hành vi chick bài hát
		playlist.onclick = function (e) {
			const songNode = e.target.closest('.song:not(.active)');
			const option = e.target.closest('.option');
			if (songNode || option) {
				// Xử lý khi click vào bài hát
				if (songNode && !option) {
					_this.currentIndex = Number(songNode.dataset.index);
					_this.loadAndSave();
					_this.renderSongs();
					audio.play();
				}
				if (option) {
					console.log(option);
				}
				// Option chưa phát triển
			}
		};
		//Xử lý điều chỉnh âm lượng
		volume.oninput = function (e) {
			_this.currentVolume = e.target.value;
			audio.volume = _this.currentVolume / 100;
			_this.volumeDisplay();
			_this.setConfig('volume', _this.currentVolume);
			_this.handleVolumeBtn();
		};
	},
	loadConfig: function () {
		if (this.config.currentIndex === undefined) {
			this.currentIndex = 0;
			this.config.volume = 100;
		} else {
			this.currentIndex = this.config.currentIndex;
			this.isRandom = this.config.isRandom;
			this.isRepeat = this.config.isRepeat;
			this.currentVolume = this.config.volume;
		}

		// Hiển thị âm lượng ban đầu
		this.volumeDisplay();
		this.handleVolumeBtn();

		// Hiển thị trạng thái ban đầu của btn random và repeat
		randomBtn.classList.toggle('active', this.isRandom);
		repeatBtn.classList.toggle('active', this.isRepeat);
	},
	loadCurrentSong: function () {
		heading.textContent = `${this.currentSong.name} - ${this.currentSong.singer}`;
		cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
		audio.src = this.currentSong.path;
	},
	loadAndSave: function () {
		this.setConfig('currentIndex', this.currentIndex);
		this.loadCurrentSong();
		this.renderSongs();
	},
	nextSong: function () {
		this.currentIndex++;
		if (this.currentIndex >= this.songs.length) {
			this.currentIndex = 0;
		}
		this.loadAndSave();
	},
	prevSong: function () {
		this.currentIndex--;
		if (this.currentIndex < 0) {
			this.currentIndex = this.songs.length - 1;
		}
		this.loadAndSave();
	},
	addRandomSong: function () {
		if (this.randomArray.length < this.songs.length - 1) {
			this.randomArray.push(this.currentIndex);
		} else {
			this.randomArray = [];
			this.randomArray.push(this.currentIndex);
		}
		console.log(this.randomArray);
	},
	randomSong: function () {
		let newIndex;
		do {
			newIndex = Math.floor(Math.random() * this.songs.length);
		} while (this.randomArray.includes(newIndex));
		this.currentIndex = newIndex;
		this.addRandomSong();
		this.loadAndSave();
	},
	scrollToActiveSong: function () {
		let view;
		if (this.currentIndex < 2) {
			view = 'end';
		} else {
			view = 'nearest';
		}
		setTimeout(function () {
			$('.song.active').scrollIntoView(
				{
					behavior: 'smooth',
					block: view,
				},
				300
			);
		});
	},
	volumeDisplay() {
		volume.value = this.currentVolume;
		var volumeColor =
			'linear-gradient(90deg, rgb(var(--accent-color))' +
			this.currentVolume +
			'%, rgb(214, 214, 214) ' +
			this.currentVolume +
			'%)';
		volume.style.background = volumeColor;
	},
	handleVolumeBtn: function () {
		const volume = this.currentVolume;
		if (volume > 50) {
			volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
		} else if (volume < 50 && volume > 0) {
			volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
		} else {
			volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
		}
	},
	start: function () {
		// Gán cấu hình từ config vào ứng dụng
		this.loadConfig();

		// Định nghĩa các thuộc tính cho object
		this.defineProperties();

		// Lắng nghe và xử lý sự kiện DOM
		this.handleEvents();

		// Tải thông tin bài hát vào UI khi tải ứng dụng, lưu vị trí bài hát đang phát
		this.loadAndSave();
	},
};

app.start();
