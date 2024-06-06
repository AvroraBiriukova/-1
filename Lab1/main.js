	// Ссылка на элемент веб страницы в котором будет отображаться графика
	var container;

	// Переменные "камера", "сцена" и "отрисовщик"
	var camera, scene, renderer;

	// Создание структуры для хранения вершин
	var geometry = new THREE.Geometry();

	// Добавление координат вершин в массив вершин
	var vertex = 255;
	let kount = vertex - 1;

	var imagedata;

	init();
	animate();

	function getPixel(imagedata, x, y) {
		var position = (x + imagedata.width * y) * 4, data = imagedata.data;
		return data[position];
	}

	// В этой функции можно добавлять объекты и выполнять их первичную настройку
	function init() {
		// Получение ссылки на элемент html страницы
		container = document.getElementById('container');

		// Создание "сцены"
		scene = new THREE.Scene();

		// Установка параметров камеры
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
		camera.position.set(vertex / 2, vertex / 2, vertex * 2);
		camera.lookAt(new THREE.Vector3(vertex / 2, 0.0, vertex / 2));

		// Создание отрисовщика
		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x000000, 1);


		container.appendChild(renderer.domElement);

		// Добавление функции обработки события изменения размеров окна
		window.addEventListener('resize', onWindowResize, false);

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var img = new Image();

		img.crossOrigin = "Anonymous"; // Установка анонимного доступа к кросс-доменным данным


		img.onload = function () {
			canvas.width = img.width;
			canvas.height = img.height;
			context.drawImage(img, 0, 0);
			imagedata = context.getImageData(0, 0, img.width, img.height);
			// Пользовательская функция генерации ландшафта
			CreateTerrain();
		}
		
		img.src = 'plateau.jpg';

	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function animate() {
		requestAnimationFrame(animate);
		render();
	}

	function render() {
		renderer.render(scene, camera);
	}

	function CreateTerrain() {
		for (let i = 0; i < vertex; i++)
			for (let j = 0; j < vertex; j++) {
				var h = getPixel(imagedata, i, j) / 10;
				geometry.vertices.push(new THREE.Vector3(i, h, j));
			}

		for (let i = 0; i < kount; i++)
			for (let j = 0; j < kount; j++) {
				geometry.faces.push(new THREE.Face3(i + j * vertex, (i + 1) + j * vertex, (i + 1) + (j + 1) * vertex));
				geometry.faces.push(new THREE.Face3(i + j * vertex, (i + 1) + (j + 1) * vertex, i + (j + 1) * vertex));
			}

		var loader = new THREE.TextureLoader();
		var tex = loader.load('grasstile.jpg');

		var mat = new THREE.MeshLambertMaterial({
			map: tex,
			wireframe: false,
			side: THREE.DoubleSide
		});

		var triangleMesh = new THREE.Mesh(geometry, mat);

		geometry.faceVertexUvs[0] = [];

		for (let i = 0; i < kount; i++)
			for (let j = 0; j < kount; j++) {
				geometry.faceVertexUvs[0].push([new THREE.Vector2(i / kount, j / kount),
				new THREE.Vector2((i + 1) / kount, j / kount),
				new THREE.Vector2((i + 1) / kount, (j + 1) / kount)]);

				geometry.faceVertexUvs[0].push([new THREE.Vector2(i / kount, j / kount),
				new THREE.Vector2((i + 1) / kount, (j + 1) / kount),
				new THREE.Vector2(i / kount, (j + 1) / kount)]);
			}

		triangleMesh.position.set(0.0, 0.0, 0.0);

		var spotlight = new THREE.PointLight(0xffffff);
		spotlight.position.set(200, 100, 100);

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		scene.add(spotlight);
		scene.add(triangleMesh);
	}


